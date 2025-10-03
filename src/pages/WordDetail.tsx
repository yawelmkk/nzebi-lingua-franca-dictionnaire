
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Loader2 } from "lucide-react";
import { useDictionary } from "@/hooks/useDictionary";
import { WordCard } from "@/components/WordCard";

const WordDetail = () => {
  const { id } = useParams();
  const { words, loading, error } = useDictionary();
  const word = words.find(w => w.id === id);

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

  if (!word) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6">
          <h2 className="text-xl font-semibold mb-4">Mot non trouvé</h2>
          <Link to="/dictionary">
            <Button>Retour au dictionnaire</Button>
          </Link>
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
            <Link to="/dictionary">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">Détail du mot</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <WordCard word={word} />
          
          {/* Actions */}
          <div className="flex gap-2">
            <Link to="/contact" className="flex-1">
              <Button variant="outline" className="w-full">
                <MessageCircle className="w-4 h-4 mr-2" />
                Signaler une erreur
              </Button>
            </Link>
            <Link to="/search" className="flex-1">
              <Button className="w-full">
                Rechercher d'autres mots
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordDetail;
