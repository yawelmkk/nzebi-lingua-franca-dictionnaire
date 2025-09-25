import { supabase } from '@/integrations/supabase/client';
import { normalizeString } from '@/lib/utils';
import { DictionaryWord } from '@/hooks/useDictionary';

interface SearchIndex {
  exact: Map<string, DictionaryWord[]>;
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
    
    words.forEach(word => {
      // Index par mot nzébi normalisé
      const normalizedNzebi = normalizeString(word.nzebi_word);
      if (!exact.has(normalizedNzebi)) {
        exact.set(normalizedNzebi, []);
      }
      exact.get(normalizedNzebi)!.push(word);

      // Index par mot français normalisé
      const normalizedFrench = normalizeString(word.french_word);
      if (!exact.has(normalizedFrench)) {
        exact.set(normalizedFrench, []);
      }
      exact.get(normalizedFrench)!.push(word);

      // Index par parties des mots pour recherche partielle
      [normalizedNzebi, normalizedFrench].forEach(text => {
        for (let i = 2; i <= text.length; i++) {
          const substring = text.substring(0, i);
          if (!exact.has(substring)) {
            exact.set(substring, []);
          }
          if (!exact.get(substring)!.includes(word)) {
            exact.get(substring)!.push(word);
          }
        }
      });
    });

    this.searchIndex = { exact, words };
  }

  search(query: string): DictionaryWord[] {
    if (!this.searchIndex || !query.trim()) return [];

    const normalizedQuery = normalizeString(query);
    const results = new Set<DictionaryWord>();
    
    // 1. Recherche exacte et par préfixe
    for (const [key, words] of this.searchIndex.exact) {
      if (key.includes(normalizedQuery)) {
        words.forEach(word => results.add(word));
      }
    }

    // 2. Si pas assez de résultats, recherche floue
    if (results.size < 5) {
      const fuzzyResults = this.fuzzySearch(normalizedQuery, 2);
      fuzzyResults.forEach(word => results.add(word));
    }

    return Array.from(results);
  }

  private fuzzySearch(query: string, maxDistance: number): DictionaryWord[] {
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
    
    return results.slice(0, 10).map(result => result.word);
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