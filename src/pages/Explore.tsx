
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Volume2, Loader2 } from "lucide-react";
import { useDictionary } from "@/hooks/useDictionary";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const Explore = () => {
  const [search, setSearch] = useState("");
  const { words, loading, error } = useDictionary();
  const { toast } = useToast();

  // Filtrer les mots selon la recherche (Nzébi ou FR)
  const filteredWords = useMemo(() => {
    if (!search.trim()) return words;
    const lower = search.toLowerCase();
    return words.filter(
      (w) =>
        w.nzebi_word.toLowerCase().includes(lower) ||
        w.french_word.toLowerCase().includes(lower)
    );
  }, [search, words]);

  // Trier alphabétiquement (Nzébi)
  const sorted = useMemo(
    () => [...filteredWords].sort((a, b) => a.nzebi_word.localeCompare(b.nzebi_word)),
    [filteredWords]
  );

  const handleSoundClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Fonctionnalité non disponible",
      description: "Cette option n'est pas encore disponible",
      duration: 3000,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-emerald-600">Chargement du dictionnaire...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header avec titre */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-emerald-800">Dictionnaire Nzébi</h1>
            <div className="flex items-center text-emerald-600">
              <span className="text-sm">•••</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
            <Input
              placeholder="Rechercher un mot en Nzébi ou en français..."
              className="pl-12 pr-4 py-3 text-lg border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 bg-white/80 backdrop-blur-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Liste des mots */}
        <div className="space-y-3">
          {sorted.length === 0 && (
            <p className="text-center text-emerald-500 mt-16 text-lg">
              Aucun mot trouvé.
            </p>
          )}
          
          {sorted.map((word) => (
            <div
              key={word.id}
              className="bg-white/90 backdrop-blur-sm rounded-lg border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between p-4">
                {/* Partie gauche avec barre verte et mot */}
                <div className="flex items-center gap-4">
                  <div className="w-1 h-12 bg-emerald-400 rounded-full"></div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-semibold text-emerald-800" translate="no">
                      {word.nzebi_word}
                    </span>
                    <button 
                      className="p-1 hover:bg-emerald-50 rounded-full transition-colors"
                      onClick={handleSoundClick}
                    >
                      <Volume2 className="w-5 h-5 text-emerald-600" />
                    </button>
                  </div>
                </div>

                {/* Partie droite avec badge de nature grammaticale */}
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200"
                  >
                    {word.part_of_speech || "autre"}
                  </Badge>
                  <button className="p-1">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
