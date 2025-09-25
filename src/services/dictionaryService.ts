import { supabase } from '@/integrations/supabase/client';
import { normalizeString } from '@/lib/utils';
import { DictionaryWord } from '@/hooks/useDictionary';

interface SearchResult {
  word: DictionaryWord;
  score: number;
  matchType: 'exact' | 'stemmed' | 'phonetic' | 'fuzzy';
}

interface SearchIndex {
  exact: Map<string, DictionaryWord[]>;
  stemmed: Map<string, DictionaryWord[]>;
  phonetic: Map<string, DictionaryWord[]>;
  words: DictionaryWord[];
}

class DictionaryService {
  private static instance: DictionaryService;
  private searchIndex: SearchIndex | null = null;
  private loading = false;
  private error: string | null = null;

  private constructor() {}

  static getInstance(): DictionaryService {
    if (!DictionaryService.instance) {
      DictionaryService.instance = new DictionaryService();
    }
    return DictionaryService.instance;
  }

  async initialize(): Promise<void> {
    if (this.searchIndex || this.loading) return;

    this.loading = true;
    this.error = null;

    try {
      const { data, error } = await supabase.functions.invoke('get-dictionnaire');
      
      if (error) {
        throw new Error('Erreur lors du chargement du dictionnaire');
      }

      if (data && Array.isArray(data)) {
        this.buildSearchIndex(data);
      } else {
        throw new Error('Format de données invalide');
      }
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Erreur de connexion';
      throw err;
    } finally {
      this.loading = false;
    }
  }

  private buildSearchIndex(words: DictionaryWord[]): void {
    const exact = new Map<string, DictionaryWord[]>();
    const stemmed = new Map<string, DictionaryWord[]>();
    const phonetic = new Map<string, DictionaryWord[]>();
    
    words.forEach(word => {
      // Index par mot nzébi normalisé
      const normalizedNzebi = normalizeString(word.nzebi_word);
      this.addToIndex(exact, normalizedNzebi, word);

      // Index par mot français normalisé
      const normalizedFrench = normalizeString(word.french_word);
      this.addToIndex(exact, normalizedFrench, word);

      // Index des racines (stemming)
      const stemmedNzebi = this.stem(normalizedNzebi);
      this.addToIndex(stemmed, stemmedNzebi, word);
      
      const stemmedFrench = this.stem(normalizedFrench);
      this.addToIndex(stemmed, stemmedFrench, word);

      // Index phonétique
      const phoneticNzebi = this.soundex(normalizedNzebi);
      this.addToIndex(phonetic, phoneticNzebi, word);
      
      const phoneticFrench = this.soundex(normalizedFrench);
      this.addToIndex(phonetic, phoneticFrench, word);

      // Index par parties des mots pour recherche partielle
      [normalizedNzebi, normalizedFrench].forEach(text => {
        for (let i = 2; i <= text.length; i++) {
          const substring = text.substring(0, i);
          this.addToIndex(exact, substring, word);
        }
      });
    });

    this.searchIndex = { exact, stemmed, phonetic, words };
  }

  search(query: string): DictionaryWord[] {
    if (!this.searchIndex || !query.trim()) return [];

    const normalizedQuery = normalizeString(query);
    const seenWords = new Set<string>();
    const results: DictionaryWord[] = [];

    // PRIORITÉ 1: Correspondances exactes
    const exactMatches = this.getExactMatches(normalizedQuery);
    exactMatches.forEach(word => {
      if (!seenWords.has(word.id)) {
        results.push(word);
        seenWords.add(word.id);
      }
    });

    // PRIORITÉ 2: Correspondances par préfixe
    const prefixMatches = this.getPrefixMatches(normalizedQuery);
    // Trier les correspondances par préfixe par longueur (plus courts = plus pertinents)
    prefixMatches.sort((a, b) => {
      const aNorm = normalizeString(a.nzebi_word);
      const bNorm = normalizeString(b.nzebi_word);
      const aFrench = normalizeString(a.french_word);
      const bFrench = normalizeString(b.french_word);
      
      // Priorité aux mots qui commencent exactement par la requête
      const aStartsNzebi = aNorm.startsWith(normalizedQuery);
      const aStartsFrench = aFrench.startsWith(normalizedQuery);
      const bStartsNzebi = bNorm.startsWith(normalizedQuery);
      const bStartsFrench = bFrench.startsWith(normalizedQuery);
      
      if ((aStartsNzebi || aStartsFrench) && !(bStartsNzebi || bStartsFrench)) return -1;
      if (!(aStartsNzebi || aStartsFrench) && (bStartsNzebi || bStartsFrench)) return 1;
      
      // Puis par longueur du mot (plus courts en premier)
      const aMinLength = Math.min(aNorm.length, aFrench.length);
      const bMinLength = Math.min(bNorm.length, bFrench.length);
      
      return aMinLength - bMinLength;
    });

    prefixMatches.forEach(word => {
      if (!seenWords.has(word.id)) {
        results.push(word);
        seenWords.add(word.id);
      }
    });

    // PRIORITÉ 3: Correspondances floues (Levenshtein)
    if (normalizedQuery.length >= 3) { // Éviter la recherche floue pour les requêtes trop courtes
      const fuzzyMatches = this.getFuzzyMatches(normalizedQuery, seenWords);
      results.push(...fuzzyMatches);
    }

    return results.slice(0, 25); // Limiter à 25 résultats
  }

  private getExactMatches(query: string): DictionaryWord[] {
    const matches: DictionaryWord[] = [];
    
    // Recherche dans l'index exact
    const exactWords = this.searchIndex?.exact.get(query) || [];
    matches.push(...exactWords);
    
    return matches;
  }

  private getPrefixMatches(query: string): DictionaryWord[] {
    if (!this.searchIndex) return [];
    
    const matches: DictionaryWord[] = [];
    
    // Recherche tous les mots qui commencent par la requête ou qui contiennent la requête
    for (const [key, words] of this.searchIndex.exact) {
      // Préfixe : le mot commence par la requête (mais n'est pas exactement la requête)
      if (key.length > query.length && key.startsWith(query)) {
        matches.push(...words);
      }
      // Contenu : le mot contient la requête (mais ne commence pas par elle)
      else if (key.length > query.length && key.includes(query) && !key.startsWith(query)) {
        matches.push(...words);
      }
    }
    
    // Supprimer les doublons
    const uniqueMatches = matches.filter((word, index, self) => 
      index === self.findIndex(w => w.id === word.id)
    );
    
    return uniqueMatches;
  }

  private getFuzzyMatches(query: string, excludeIds: Set<string>): DictionaryWord[] {
    if (!this.searchIndex) return [];
    
    const fuzzyResults: Array<{ word: DictionaryWord; distance: number }> = [];
    const maxDistance = Math.min(3, Math.floor(query.length / 2)); // Distance maximale adaptative
    
    this.searchIndex.words.forEach(word => {
      if (excludeIds.has(word.id)) return;
      
      // Calculer la distance pour les mots nzébi et français
      const nzebiDistance = this.levenshteinDistance(query, normalizeString(word.nzebi_word));
      const frenchDistance = this.levenshteinDistance(query, normalizeString(word.french_word));
      
      // Prendre la plus petite distance
      const minDistance = Math.min(nzebiDistance, frenchDistance);
      
      // Ajouter seulement si la distance est acceptable
      if (minDistance <= maxDistance) {
        fuzzyResults.push({ word, distance: minDistance });
      }
    });
    
    // Trier par distance croissante (plus petite distance = plus pertinent)
    fuzzyResults.sort((a, b) => {
      if (a.distance !== b.distance) return a.distance - b.distance;
      // En cas d'égalité, trier alphabétiquement
      return a.word.nzebi_word.localeCompare(b.word.nzebi_word);
    });
    
    return fuzzyResults.slice(0, 10).map(result => result.word);
  }

  private fuzzySearch(query: string, maxDistance: number): Array<{ word: DictionaryWord; distance: number }> {
    if (!this.searchIndex) return [];

    const results: Array<{ word: DictionaryWord; distance: number }> = [];

    this.searchIndex.words.forEach(word => {
      const nzebiDistance = this.levenshteinDistance(query, normalizeString(word.nzebi_word));
      const frenchDistance = this.levenshteinDistance(query, normalizeString(word.french_word));
      
      const minDistance = Math.min(nzebiDistance, frenchDistance);
      
      if (minDistance <= maxDistance) {
        results.push({ word, distance: minDistance });
      }
    });

    // Trier par distance croissante
    results.sort((a, b) => a.distance - b.distance);
    
    return results.slice(0, 10);
  }

  private addToIndex(index: Map<string, DictionaryWord[]>, key: string, word: DictionaryWord): void {
    if (!index.has(key)) {
      index.set(key, []);
    }
    const words = index.get(key)!;
    if (!words.some(w => w.id === word.id)) {
      words.push(word);
    }
  }

  private stem(word: string): string {
    if (word.length < 3) return word;
    
    // Règles de stemming simplifiées pour le français
    const frenchSuffixes = [
      'tion', 'ment', 'ness', 'able', 'ible', 'ique', 'isme', 'iste',
      'eur', 'euse', 'age', 'ent', 'ant', 'ait', 'ais', 'ons', 'ez',
      'ont', 'era', 'rai', 'ras', 'rez', 'ons', 'ont'
    ];

    let stemmed = word;
    
    // Enlever les suffixes courants
    for (const suffix of frenchSuffixes) {
      if (stemmed.endsWith(suffix) && stemmed.length > suffix.length + 2) {
        stemmed = stemmed.slice(0, -suffix.length);
        break;
      }
    }

    // Règles spécifiques pour les verbes français
    if (stemmed.endsWith('er') && stemmed.length > 4) {
      stemmed = stemmed.slice(0, -2);
    } else if (stemmed.endsWith('ir') && stemmed.length > 4) {
      stemmed = stemmed.slice(0, -2);
    } else if (stemmed.endsWith('re') && stemmed.length > 4) {
      stemmed = stemmed.slice(0, -2);
    }

    return stemmed;
  }

  private soundex(word: string): string {
    if (!word) return '';
    
    word = word.toLowerCase();
    
    // Garder la première lettre
    let soundex = word[0];
    
    // Mapping des consonnes
    const mapping: { [key: string]: string } = {
      'b': '1', 'f': '1', 'p': '1', 'v': '1',
      'c': '2', 'g': '2', 'j': '2', 'k': '2', 'q': '2', 's': '2', 'x': '2', 'z': '2',
      'd': '3', 't': '3',
      'l': '4',
      'm': '5', 'n': '5',
      'r': '6'
    };
    
    // Convertir les consonnes
    for (let i = 1; i < word.length && soundex.length < 4; i++) {
      const char = word[i];
      const code = mapping[char];
      
      if (code && code !== soundex[soundex.length - 1]) {
        soundex += code;
      }
    }
    
    // Compléter avec des zéros si nécessaire
    while (soundex.length < 4) {
      soundex += '0';
    }
    
    return soundex.substring(0, 4);
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // insertion
          matrix[j - 1][i] + 1,     // deletion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  getWords(): DictionaryWord[] {
    return this.searchIndex?.words || [];
  }

  isLoading(): boolean {
    return this.loading;
  }

  getError(): string | null {
    return this.error;
  }
}

export const dictionaryService = DictionaryService.getInstance();