
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Search, Volume2, MoreHorizontal, Settings, MessageCircle, Shield, Info, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useDictionary } from "@/hooks/useDictionary";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { words, loading, error } = useDictionary();

  // Filtrer les mots selon la recherche
  const filteredWords = searchTerm.trim() 
    ? words.filter(word => 
        word.nzebi_word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.french_word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (word.part_of_speech && word.part_of_speech.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : words;

  // Trier alphabétiquement par mot Nzébi
  const sortedWords = filteredWords.sort((a, b) => a.nzebi_word.localeCompare(b.nzebi_word));

  const handleSoundClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Fonctionnalité non disponible",
      description: "Cette option n'est pas encore disponible",
      duration: 3000,
    });
  };

  const handleMenuClick = (option: string) => {
    if (option === "contactez-nous") {
      // Ouvrir la boîte mail avec l'adresse pré-remplie
      window.location.href = "mailto:languenzebiofficiel@gmail.com";
    } else if (option === "version") {
      toast({
        title: "Version de l'application",
        description: "Version: 1.1.2",
        duration: 3000,
      });
    } else if (option === "à propos") {
      toast({
        title: "À propos",
        description: "Cette application est un dictionnaire numérique Nzébi–Français conçu pour faciliter l'apprentissage, la préservation et la valorisation de la langue Nzébi.\n\nLe Nzébi est une langue bantoue parlée principalement au Gabon, en République du Congo et en République démocratique du Congo, par le peuple Nzébi. Comme beaucoup d'autres langues africaines, elle est aujourd'hui menacée par la disparition progressive des langues locales au profit de langues dominantes comme le français.\nCette application s'inscrit donc dans une démarche de revalorisation culturelle et linguistique.\n\nElle a été créée par le groupe Langue Nzébi Officiel, une initiative collective qui mène des recherches linguistiques, culturelles et historiques pour proposer un contenu fiable, enrichi et fidèle à la langue telle qu'elle est parlée par les locuteurs natifs.\n\nL'application est en constante évolution et sera régulièrement mise à jour pour intégrer :\n\nde nouveaux mots,\n\ndes corrections ou suggestions de la communauté,\n\ndes exemples d'utilisation,\n\net éventuellement, des fichiers audio pour la prononciation.\n\nCette initiative est avant tout un projet communautaire et éducatif, ouvert à tous ceux qui veulent (re)découvrir le Nzébi, que ce soit pour des raisons culturelles, personnelles ou académiques.\n\nSi vous remarquez une erreur ou souhaitez proposer une correction ou une contribution, vous pouvez nous contacter directement via l'option « Contactez-nous » dans le menu.\n\nMerci de faire partie de ce voyage vers la sauvegarde et la transmission du patrimoine linguistique Nzébi.",
        duration: 10000,
      });
    } else {
      toast({
        title: option.charAt(0).toUpperCase() + option.slice(1),
        description: "Cette option n'est pas encore disponible",
        duration: 3000,
      });
    }
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
      {/* Header fixe */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-emerald-800">Dictionnaire Nzébi</h1>
            
            {/* Menu déroulant avec trois points */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border border-emerald-100 shadow-lg">
                <DropdownMenuItem onClick={() => handleMenuClick("paramètres")} className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMenuClick("contactez-nous")} className="cursor-pointer">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contactez-nous
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMenuClick("confidentialité")} className="cursor-pointer">
                  <Shield className="w-4 h-4 mr-2" />
                  Confidentialité
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleMenuClick("version")} className="cursor-pointer">
                  <Info className="w-4 h-4 mr-2" />
                  Version
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMenuClick("à propos")} className="cursor-pointer">
                  <Info className="w-4 h-4 mr-2" />
                  À propos
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Barre de recherche dans le header fixe */}
          <div className="mt-4">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
              <Input
                placeholder="Rechercher un mot en Nzébi, en français ou par nature grammaticale..."
                className="pl-12 pr-4 py-3 text-lg border-emerald-200 focus:border-emerald-400 focus:ring-emerald-200 bg-white/80 backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {sortedWords.length === 0 && (
            <p className="text-center text-emerald-500 mt-16 text-lg">
              Aucun mot trouvé.
            </p>
          )}

          {/* Liste simple des mots sans regroupement par catégorie */}
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
                    <Badge 
                      variant="secondary" 
                      className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200 mr-4"
                    >
                      {word.part_of_speech || "autre"}
                    </Badge>
                  </div>
                </AccordionTrigger>
                
                <AccordionContent className="px-4 pb-4">
                  <div className="ml-5 space-y-3">
                    {/* Traduction française */}
                    <div>
                      <h4 className="font-semibold text-emerald-700 mb-1">Traduction française :</h4>
                      <p className="text-gray-700">{word.french_word}</p>
                    </div>
                    
                    {/* Nature du mot */}
                    <div>
                      <h4 className="font-semibold text-emerald-700 mb-1">Nature :</h4>
                      <p className="text-gray-700 capitalize">{word.part_of_speech || "autre"}</p>
                    </div>
                    
                    {/* Exemple en Nzébi s'il existe */}
                    {word.example_nzebi && (
                      <div>
                        <h4 className="font-semibold text-emerald-700 mb-1">Exemple en Nzébi :</h4>
                        <p className="text-gray-700 italic">{word.example_nzebi}</p>
                      </div>
                    )}

                    {/* Exemple en français s'il existe */}
                    {word.example_french && (
                      <div>
                        <h4 className="font-semibold text-emerald-700 mb-1">Exemple en français :</h4>
                        <p className="text-gray-700 italic">{word.example_french}</p>
                      </div>
                    )}

                    {/* Forme plurielle s'il existe */}
                    {word.plural_form && (
                      <div>
                        <h4 className="font-semibold text-emerald-700 mb-1">Forme plurielle :</h4>
                        <p className="text-gray-700">{word.plural_form}</p>
                      </div>
                    )}

                    {/* Synonymes s'ils existent */}
                    {word.synonyms && (
                      <div>
                        <h4 className="font-semibold text-emerald-700 mb-1">Synonymes :</h4>
                        <p className="text-gray-700">{word.synonyms}</p>
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
