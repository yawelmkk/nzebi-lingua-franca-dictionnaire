
import { useState, useEffect } from 'react';
import { dictionaryService } from '@/services/dictionaryService';

export interface DictionaryWord {
  id: string;
  nzebi_word: string;
  french_word: string;
  part_of_speech?: string;
  example_nzebi?: string;
  example_french?: string;
  pronunciation_url?: string;
  plural_form?: string;
  synonyms?: string;
  scientific_name?: string;
  imperative?: string;
  is_verb?: boolean;
}

export const useDictionary = () => {
  const [words, setWords] = useState<DictionaryWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDictionary = async () => {
      try {
        setLoading(true);
        setError(null);
        
        await dictionaryService.initialize();
        setWords(dictionaryService.getWords());
      } catch (err) {
        console.error('Erreur lors de l\'initialisation du dictionnaire:', err);
        setError(dictionaryService.getError());
      } finally {
        setLoading(false);
      }
    };

    initializeDictionary();
  }, []);

  return { words, loading, error };
};

export const useSearch = () => {
  return {
    search: (query: string) => dictionaryService.search(query)
  };
};
