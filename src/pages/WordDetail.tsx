
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Volume2, MessageCircle } from "lucide-react";
import { mockDictionary } from "@/data/mockDictionary";

const WordDetail = () => {
  const { id } = useParams();
  const word = mockDictionary.find(w => w.id === id);

  if (!word) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Mot non trouvé</h2>
            <Link to="/dictionary">
              <Button>Retour au dictionnaire</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePlayAudio = () => {
    // Placeholder for audio functionality
    alert("Fonctionnalité audio à venir !");
  };

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
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-3xl text-gray-800" translate="no">
                  {word.nzebi}
                </CardTitle>
                <Button variant="outline" size="sm" onClick={handlePlayAudio}>
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
              {word.category && (
                <Badge variant="secondary" className="w-fit">
                  {word.category}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Translation */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Traduction française
                </h3>
                <p className="text-xl text-indigo-600" translate="no">
                  {word.french}
                </p>
              </div>

              {/* Example */}
              {word.example && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Exemple d'utilisation
                  </h3>
                  <p className="text-gray-600 italic bg-gray-50 p-4 rounded-lg" translate="no">
                    "{word.example}"
                  </p>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">
                    Longueur
                  </h3>
                  <p className="text-gray-600">
                    {word.nzebi.length} caractères
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">
                    Première lettre
                  </h3>
                  <p className="text-gray-600">
                    {word.nzebi.charAt(0).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WordDetail;
