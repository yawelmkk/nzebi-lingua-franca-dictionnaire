
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
    const fetchDictionary = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase.functions.invoke('get-dictionnaire');
        
        if (error) {
          console.error('Erreur lors de la récupération du dictionnaire:', error);
          setError('Erreur lors du chargement du dictionnaire');
          return;
        }
        
        if (data && Array.isArray(data)) {
          setWords(data);
        } else {
          setError('Format de données invalide');
        }
      } catch (err) {
        console.error('Erreur réseau:', err);
        setError('Erreur de connexion');
      } finally {
        setLoading(false);
      }
    };

    fetchDictionary();
  }, []);

  return { words, loading, error };
};
