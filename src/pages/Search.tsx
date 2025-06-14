
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search as SearchIcon, ArrowLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { mockDictionary } from "@/data/mockDictionary";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || "");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const performSearch = (term: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate search with delay
    setTimeout(() => {
      const filtered = mockDictionary.filter(word => 
        word.nzebi.toLowerCase().includes(term.toLowerCase()) ||
        word.french.toLowerCase().includes(term.toLowerCase()) ||
        word.example?.toLowerCase().includes(term.toLowerCase())
      );
      setResults(filtered);
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    if (searchTerm) {
      performSearch(searchTerm);
    }
  }, []);

  const handleSearch = () => {
    performSearch(searchTerm);
  };

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
          <div className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher en Nzébi ou en français..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? "..." : "Rechercher"}
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto">
          {searchTerm && !isLoading && (
            <p className="text-gray-600 mb-4">
              {results.length} résultat(s) pour "{searchTerm}"
            </p>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <p className="text-gray-500">Recherche en cours...</p>
            </div>
          )}

          <div className="space-y-4">
            {results.map((word) => (
              <Card key={word.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">
                        {word.nzebi}
                      </h3>
                      <p className="text-lg text-indigo-600 mb-2">
                        {word.french}
                      </p>
                      {word.category && (
                        <Badge variant="secondary" className="mb-2">
                          {word.category}
                        </Badge>
                      )}
                      {word.example && (
                        <div className="text-sm text-gray-600 italic">
                          <strong>Exemple :</strong> {word.example}
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

          {searchTerm && !isLoading && results.length === 0 && (
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
