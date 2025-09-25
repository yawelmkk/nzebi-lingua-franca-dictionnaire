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
    const results: SearchResult[] = [];
    const seenWords = new Set<string>();

    // 1. Recherche exacte (score: 100)
    const exactMatches = this.searchIndex.exact.get(normalizedQuery) || [];
    exactMatches.forEach(word => {
      if (!seenWords.has(word.id)) {
        results.push({ word, score: 100, matchType: 'exact' });
        seenWords.add(word.id);
      }
    });

    // 2. Recherche par préfixe exact (score: 90)
    for (const [key, words] of this.searchIndex.exact) {
      if (key.startsWith(normalizedQuery) && key !== normalizedQuery) {
        words.forEach(word => {
          if (!seenWords.has(word.id)) {
            results.push({ word, score: 90, matchType: 'exact' });
            seenWords.add(word.id);
          }
        });
      }
    }

    // 3. Recherche par racine (stemming) (score: 70)
    const stemmedQuery = this.stem(normalizedQuery);
    const stemmedMatches = this.searchIndex.stemmed.get(stemmedQuery) || [];
    stemmedMatches.forEach(word => {
      if (!seenWords.has(word.id)) {
        results.push({ word, score: 70, matchType: 'stemmed' });
        seenWords.add(word.id);
      }
    });

    // 4. Recherche phonétique (score: 60)
    const phoneticQuery = this.soundex(normalizedQuery);
    const phoneticMatches = this.searchIndex.phonetic.get(phoneticQuery) || [];
    phoneticMatches.forEach(word => {
      if (!seenWords.has(word.id)) {
        results.push({ word, score: 60, matchType: 'phonetic' });
        seenWords.add(word.id);
      }
    });

    // 5. Recherche par contenu (score: 50)
    for (const [key, words] of this.searchIndex.exact) {
      if (key.includes(normalizedQuery) && !key.startsWith(normalizedQuery)) {
        words.forEach(word => {
          if (!seenWords.has(word.id)) {
            results.push({ word, score: 50, matchType: 'exact' });
            seenWords.add(word.id);
          }
        });
      }
    }

    // 6. Recherche floue avec Levenshtein (score: 1-40)
    if (results.length < 10) {
      const fuzzyResults = this.fuzzySearch(normalizedQuery, 2);
      fuzzyResults.forEach(({ word, distance }) => {
        if (!seenWords.has(word.id)) {
          const score = Math.max(1, 40 - (distance * 10));
          results.push({ word, score, matchType: 'fuzzy' });
          seenWords.add(word.id);
        }
      });
    }

    // Trier par score décroissant puis alphabétiquement
    results.sort((a, b) => {
      if (a.score !== b.score) return b.score - a.score;
      return a.word.nzebi_word.localeCompare(b.word.nzebi_word);
    });

    return results.slice(0, 20).map(result => result.word);
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