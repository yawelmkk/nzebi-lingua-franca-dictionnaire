
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
    } else if (option === "confidentialité") {
      toast({
        title: "Politique de confidentialité",
        description: "Politique de confidentialité\nDernière mise à jour : 14 juin 2025\n\nNous respectons votre vie privée. Cette application, développée par le groupe Langue Nzébi Officiel, a été conçue dans un esprit éducatif et communautaire. À ce titre, nous nous engageons à protéger les données personnelles des utilisateurs.\n\n1. Données collectées\nNous ne collectons aucune donnée personnelle ni aucune information d'identification concernant les utilisateurs de cette application.\n\nL'application ne demande pas :\nd'accès à vos contacts,\nde localisation,\nde compte utilisateur,\nni d'autres permissions sensibles.\n\n2. Aucune publicité ni suivi\nL'application ne contient aucune publicité, et aucun outil de suivi tiers (comme Google Analytics, Facebook SDK, etc.) n'est intégré.\n\n3. Fonctionnalités communautaires\nSi vous choisissez de nous contacter via l'option « Contactez-nous » dans l'application, cela ouvrira simplement votre application d'e-mail. Vous êtes alors libre de nous écrire, mais aucune information n'est enregistrée par l'application elle-même.\n\n4. Sécurité\nMême si nous ne collectons aucune donnée, nous mettons un point d'honneur à maintenir l'application sécurisée et stable pour tous les utilisateurs.\n\n5. Modifications\nCette politique de confidentialité peut être mise à jour si de nouvelles fonctionnalités sont ajoutées. Dans ce cas, nous vous en informerons directement dans l'application.",
        duration: 12000,
      });
    } else if (option === "à propos") {
      toast({
        title: "Politique de Confidentialité du Dictionnaire Nzébi",
        description: "1. Introduction\nL'application Dictionnaire Nzébi (« nous », « notre », « nos ») est une application mobile conçue pour fournir une ressource linguistique sur la langue inzèbi. Votre vie privée est de la plus haute importance.\n\nLa présente politique de confidentialité vise à vous informer de la manière dont nous traitons vos données.\n\n2. Absence de Collecte de Données Personnelles\nLe Dictionnaire Nzébi est conçu pour fonctionner sans collecter, stocker, transmettre ou traiter aucune donnée personnelle de ses utilisateurs.\n\nNous ne demandons ni n'enregistrons votre nom, votre adresse e-mail, votre localisation, vos identifiants d'appareil ou toute autre information permettant de vous identifier.\n\nL'application ne nécessite pas de connexion à un compte utilisateur.\n\nToutes les recherches de mots et les fonctionnalités (comme les favoris ou l'historique) sont stockées localement sur votre propre appareil et ne sont jamais transmises à nos serveurs ou à des tiers.\n\n3. Données Non-Personnelles\nNous n'utilisons aucun outil d'analyse tiers ni aucun service de suivi qui pourrait collecter des informations sur la manière dont vous utilisez l'application.\n\nSi, à l'avenir, nous décidions d'intégrer des outils d'analyse pour améliorer l'application (par exemple, pour savoir quelles fonctionnalités sont les plus utilisées), nous veillerons à ce que ces données soient :\n\nAnonymes et agrégées (ne permettant pas d'identifier un utilisateur individuel).\n\nEt nous mettrons à jour cette politique en conséquence.\n\n4. Services Tiers\nL'application est autonome et ne partage pas vos données avec des services tiers, des annonceurs ou des partenaires.\n\nSi l'application est disponible via une boutique (comme l'App Store d'Apple ou le Google Play Store), leurs politiques de confidentialité respectives régissent les données qu'ils pourraient collecter au moment du téléchargement.\n\n5. Sécurité\nPuisque nous ne collectons aucune donnée personnelle, le risque de fuite de données personnelles est nul. La sécurité de vos données est assurée par le fait même qu'elles ne quittent jamais votre appareil.\n\n6. Contact\nSi vous avez des questions concernant cette politique de confidentialité, vous pouvez nous contacter à l'adresse suivante :\n\nlanguenzebiofficiel@gmail.com",
        duration: 15000,
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
      <div className="h-screen w-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center fixed inset-0">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-emerald-600">Chargement du dictionnaire...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center fixed inset-0">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex flex-col fixed inset-0 overflow-hidden">
      {/* Header fixe */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 shadow-sm flex-shrink-0 z-50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-emerald-800">Dictionnaire Nzébi</h1>
            
            {/* Menu déroulant avec trois points */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border border-emerald-100 shadow-lg z-50">
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

      {/* Contenu principal avec scroll */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-6">
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
                          <span className="text-2xl font-semibold text-emerald-800" translate="no">
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
                        <p className="text-xl font-medium text-gray-700" translate="no">{word.french_word}</p>
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
                          <p className="text-gray-700 italic" translate="no">{word.example_nzebi}</p>
                        </div>
                      )}

                      {/* Exemple en français s'il existe */}
                      {word.example_french && (
                        <div>
                          <h4 className="font-semibold text-emerald-700 mb-1">Exemple en français :</h4>
                          <p className="text-lg text-gray-700 italic" translate="no">{word.example_french}</p>
                        </div>
                      )}

                      {/* Forme plurielle s'il existe */}
                      {word.plural_form && (
                        <div>
                          <h4 className="font-semibold text-emerald-700 mb-1">Forme plurielle :</h4>
                          <p className="text-gray-700" translate="no">{word.plural_form}</p>
                        </div>
                      )}

                      {/* Synonymes s'ils existent */}
                      {word.synonyms && (
                        <div>
                          <h4 className="font-semibold text-emerald-700 mb-1">Synonymes :</h4>
                          <p className="text-gray-700" translate="no">{word.synonyms}</p>
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
    </div>
  );
};

export default Index;
