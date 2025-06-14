
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Volume2, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { mockDictionary } from "@/data/mockDictionary";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Mapper les catégories vers des natures grammaticales
  const categoryToGrammar = {
    "salutation": "nom",
    "famille": "nom", 
    "spiritualité": "nom",
    "nature": "nom",
    "habitat": "nom",
    "nourriture": "nom",
    "personne": "nom",
    "communication": "nom",
    "sentiment": "nom",
    "corps": "nom"
  };

  // Filtrer les mots selon la recherche
  const filteredWords = searchTerm.trim() 
    ? mockDictionary.filter(word => 
        word.nzebi.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.french.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : mockDictionary;

  // Grouper par nature grammaticale
  const groupedWords = filteredWords.reduce((acc, word) => {
    const grammar = categoryToGrammar[word.category] || "autre";
    if (!acc[grammar]) {
      acc[grammar] = [];
    }
    acc[grammar].push(word);
    return acc;
  }, {} as Record<string, typeof mockDictionary>);

  // Trier chaque groupe alphabétiquement
  Object.keys(groupedWords).forEach(key => {
    groupedWords[key].sort((a, b) => a.nzebi.localeCompare(b.nzebi));
  });

  const handleSoundClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Fonctionnalité non disponible",
      description: "Cette option n'est pas encore disponible",
      duration: 3000,
    });
  };

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
              placeholder="Rechercher un mot en Nzébi, en français ou par catégorie..."
              className="pl-12 pr-4 py-3 text-lg border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 bg-white/80 backdrop-blur-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Onglets par nature grammaticale */}
        <div className="max-w-4xl mx-auto">
          {Object.keys(groupedWords).length === 0 && (
            <p className="text-center text-emerald-500 mt-16 text-lg">
              Aucun mot trouvé.
            </p>
          )}

          {Object.keys(groupedWords).length > 0 && (
            <Tabs defaultValue={Object.keys(groupedWords)[0]} className="w-full">
              <TabsList className="grid w-full grid-cols-auto mb-6 bg-white/80 backdrop-blur-sm">
                {Object.keys(groupedWords).map((grammar) => (
                  <TabsTrigger 
                    key={grammar} 
                    value={grammar}
                    className="capitalize data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700"
                  >
                    {grammar}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(groupedWords).map(([grammar, words]) => (
                <TabsContent key={grammar} value={grammar} className="mt-0">
                  <Accordion type="single" collapsible className="space-y-3">
                    {words.map((word) => (
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
                                  onClick={handleSoundClick}
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
                              <p className="text-gray-700 capitalize">{grammar}</p>
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
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
