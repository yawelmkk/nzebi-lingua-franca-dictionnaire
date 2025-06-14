
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Volume2, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { mockDictionary } from "@/data/mockDictionary";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrer les mots selon la recherche
  const filteredWords = searchTerm.trim() 
    ? mockDictionary.filter(word => 
        word.nzebi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.french.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mockDictionary;

  // Trier alphabétiquement
  const sortedWords = [...filteredWords].sort((a, b) => a.nzebi.localeCompare(b.nzebi));

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-emerald-800">Dictionnaire Nzébi</h1>
            <Link to="/contact">
              <Button variant="outline" size="sm">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-6">
        {/* Barre de recherche */}
        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
            <Input
              placeholder="Rechercher un mot en Nzébi ou en français..."
              className="pl-12 pr-4 py-3 text-lg border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 bg-white/80 backdrop-blur-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Liste des mots avec accordéons */}
        <div className="max-w-4xl mx-auto">
          {sortedWords.length === 0 && (
            <p className="text-center text-emerald-500 mt-16 text-lg">
              Aucun mot trouvé.
            </p>
          )}
          
          <Accordion type="single" collapsible className="space-y-3">
            {sortedWords.map((word) => (
              <AccordionItem 
                key={word.id} 
                value={word.id}
                className="bg-white/90 backdrop-blur-sm rounded-lg border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <AccordionTrigger className="px-4 py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    {/* Partie gauche avec barre verte et mot */}
                    <div className="flex items-center gap-4">
                      <div className="w-1 h-12 bg-emerald-400 rounded-full"></div>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-semibold text-emerald-800">
                          {word.nzebi}
                        </span>
                        <button 
                          className="p-1 hover:bg-emerald-50 rounded-full transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Volume2 className="w-5 h-5 text-emerald-600" />
                        </button>
                      </div>
                    </div>

                    {/* Partie droite avec badge de catégorie */}
                    <Badge 
                      variant="secondary" 
                      className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200 mr-4"
                    >
                      {word.category}
                    </Badge>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="px-4 pb-4">
                  <div className="ml-5 space-y-3">
                    {/* Traduction française */}
                    <div>
                      <h4 className="font-semibold text-emerald-700 mb-1">Traduction française :</h4>
                      <p className="text-gray-700">{word.french}</p>
                    </div>
                    
                    {/* Nature du mot */}
                    <div>
                      <h4 className="font-semibold text-emerald-700 mb-1">Nature :</h4>
                      <p className="text-gray-700 capitalize">{word.category}</p>
                    </div>
                    
                    {/* Exemple s'il existe */}
                    {word.example && (
                      <div>
                        <h4 className="font-semibold text-emerald-700 mb-1">Exemple :</h4>
                        <p className="text-gray-700 italic">{word.example}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Index;
