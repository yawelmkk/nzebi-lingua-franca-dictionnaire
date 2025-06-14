
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Book, Users, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    if (searchTerm.trim()) {
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-indigo-800">Dictionnaire Nzébi–Français</h1>
            <Link to="/contact">
              <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Découvrez la langue Nzébi
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Un dictionnaire numérique moderne pour apprendre et comprendre la langue Nzébi avec des traductions en français.
          </p>
          
          {/* Image placeholder */}
          <div className="mb-8">
            <img 
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop" 
              alt="Dictionnaire Nzébi-Français" 
              className="rounded-lg shadow-lg mx-auto w-full max-w-2xl h-64 object-cover"
            />
          </div>

          {/* Search Bar */}
          <div className="flex gap-2 max-w-md mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher un mot..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} className="bg-indigo-600 hover:bg-indigo-700">
              Rechercher
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Search className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
              <CardTitle>Recherche Intelligente</CardTitle>
              <CardDescription>
                Recherchez des mots en Nzébi ou en français et obtenez des traductions instantanées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/search">
                <Button variant="outline" className="w-full">
                  Commencer la recherche
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Book className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
              <CardTitle>Liste Alphabétique</CardTitle>
              <CardDescription>
                Parcourez tous les mots disponibles dans l'ordre alphabétique
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/dictionary">
                <Button variant="outline" className="w-full">
                  Voir le dictionnaire
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-12 h-12 mx-auto text-indigo-600 mb-4" />
              <CardTitle>Contribuer</CardTitle>
              <CardDescription>
                Aidez-nous à améliorer le dictionnaire en signalant des erreurs ou en proposant des corrections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/contact">
                <Button variant="outline" className="w-full">
                  Nous contacter
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-3xl font-bold text-indigo-600">500+</h3>
              <p className="text-gray-600">Mots traduits</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-indigo-600">50+</h3>
              <p className="text-gray-600">Phrases d'exemple</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-indigo-600">100%</h3>
              <p className="text-gray-600">Gratuit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Dictionnaire Nzébi–Français. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
