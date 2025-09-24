
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useDictionary } from "@/hooks/useDictionary";
import { normalizeString } from "@/lib/utils";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || "");
  const { words, loading, error } = useDictionary();

  // Recherche instantanée et dynamique avec normalisation des accents
  const results = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const normalizedSearch = normalizeString(searchTerm);
    
    return words.filter(word => {
      const normalizedNzebi = normalizeString(word.nzebi_word);
      const normalizedFrench = normalizeString(word.french_word);
      const normalizedExampleNzebi = word.example_nzebi ? normalizeString(word.example_nzebi) : '';
      const normalizedExampleFrench = word.example_french ? normalizeString(word.example_french) : '';
      
      return normalizedNzebi.includes(normalizedSearch) ||
             normalizedFrench.includes(normalizedSearch) ||
             normalizedExampleNzebi.includes(normalizedSearch) ||
             normalizedExampleFrench.includes(normalizedSearch);
    });
  }, [searchTerm, words]);

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
            <h1 className="text-xl font-semibold text-gray-800">Recherche</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Rechercher en Nzébi ou en français (recherche instantanée)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto">
          {searchTerm && (
            <p className="text-gray-600 mb-4">
              {results.length} résultat(s) pour "{searchTerm}"
            </p>
          )}

          <div className="space-y-4">
            {results.map((word) => (
              <Card key={word.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-gray-800 mb-1">
                        {word.nzebi_word}
                      </h3>
                      <p className="text-xl font-medium text-indigo-600 mb-2">
                        {word.french_word}
                      </p>
                      {word.part_of_speech && (
                        <Badge variant="secondary" className="mb-2">
                          {word.part_of_speech}
                        </Badge>
                      )}
                      {word.example_french && (
                        <div className="text-lg text-gray-600 italic mb-2">
                          <strong>Exemple français :</strong> {word.example_french}
                        </div>
                      )}
                      {word.example_nzebi && (
                        <div className="text-lg text-gray-600 italic">
                          <strong>Exemple nzébi :</strong> {word.example_nzebi}
                        </div>
                      )}
                    </div>
                    <Link to={`/word/${word.id}`}>
                      <Button variant="outline" size="sm">
                        Détails
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {searchTerm && results.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Aucun résultat trouvé pour "{searchTerm}"</p>
              <Link to="/contact">
                <Button variant="outline">
                  Proposer ce mot
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
