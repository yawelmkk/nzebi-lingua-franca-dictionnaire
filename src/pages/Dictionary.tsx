
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDictionary } from "@/hooks/useDictionary";

const Dictionary = () => {
  const [filter, setFilter] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const { words, loading, error } = useDictionary();

  // Generate alphabet
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Filter and sort words
  const filteredWords = useMemo(() => {
    if (!words.length) return [];
    
    let filteredWords = words;

    if (filter) {
      filteredWords = filteredWords.filter(word => 
        word.nzebi_word.toLowerCase().includes(filter.toLowerCase()) ||
        word.french_word.toLowerCase().includes(filter.toLowerCase())
      );
    }

    if (selectedLetter) {
      filteredWords = filteredWords.filter(word => 
        word.nzebi_word.charAt(0).toUpperCase() === selectedLetter
      );
    }

    return filteredWords.sort((a, b) => a.nzebi_word.localeCompare(b.nzebi_word));
  }, [words, filter, selectedLetter]);

  // Group words by first letter
  const groupedWords = useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    filteredWords.forEach(word => {
      const firstLetter = word.nzebi_word.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(word);
    });
    return groups;
  }, [filteredWords]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-indigo-600">Chargement du dictionnaire...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">Dictionnaire</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Filtrer les mots..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Alphabet Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedLetter === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedLetter(null)}
            >
              Tout
            </Button>
            {alphabet.map(letter => (
              <Button
                key={letter}
                variant={selectedLetter === letter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLetter(letter)}
              >
                {letter}
              </Button>
            ))}
          </div>
        </div>

        {/* Words List */}
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600 mb-4">
            {filteredWords.length} mot(s) affiché(s)
          </p>

          {Object.keys(groupedWords).sort().map(letter => (
            <div key={letter} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
                {letter}
              </h2>
              <div className="grid gap-4">
                {groupedWords[letter].map(word => (
                  <Card key={word.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-semibold text-gray-800" translate="no">
                              {word.nzebi_word}
                            </h3>
                            {word.part_of_speech && (
                              <Badge variant="secondary" className="text-xs">
                                {word.part_of_speech}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xl font-medium text-indigo-600 mb-1" translate="no">
                            {word.french_word}
                          </p>
                          {word.plural_form && (
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Pluriel :</strong> <span translate="no">{word.plural_form}</span>
                            </p>
                          )}
                          {word.imperative && (
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Impératif :</strong> <span translate="no">{word.imperative}</span>
                            </p>
                          )}
                          {word.synonyms && (
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Synonymes :</strong> <span translate="no">{word.synonyms}</span>
                            </p>
                          )}
                          {word.example_nzebi && (
                            <p className="text-sm text-gray-600 italic mb-1">
                              <strong>Exemple nzébi :</strong> <span translate="no">{word.example_nzebi}</span>
                            </p>
                          )}
                          {word.example_french && (
                            <p className="text-sm text-gray-600 italic" translate="no">
                              <strong>Exemple français :</strong> {word.example_french}
                            </p>
                          )}
                        </div>
                        <Link to={`/word/${word.id}`}>
                          <Button variant="outline" size="sm">
                            Voir
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {filteredWords.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucun mot trouvé avec ces critères.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dictionary;
