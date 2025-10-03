
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, ArrowLeft, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useDictionary, useSearch } from "@/hooks/useDictionary";
import { useDebounce } from "@/hooks/useDebounce";
import { WordCard } from "@/components/WordCard";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || "");
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounce de 300ms
  const { loading, error } = useDictionary();
  const { search } = useSearch();

  // Recherche optimisée avec debouncing pour éviter les blocages
  const results = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return [];
    return search(debouncedSearchTerm);
  }, [debouncedSearchTerm, search]);

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
          {debouncedSearchTerm && (
            <p className="text-gray-600 mb-4">
              {results.length} résultat(s) pour "{debouncedSearchTerm}"
            </p>
          )}

          <div className="space-y-4">
            {results.map((word) => (
              <WordCard key={word.id} word={word} showDetailsButton />
            ))}
          </div>

          {debouncedSearchTerm && results.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Aucun résultat trouvé pour "{debouncedSearchTerm}"</p>
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
