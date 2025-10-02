
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Volume2, MoreHorizontal, Settings, MessageCircle, Shield, Info, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useDictionary } from "@/hooks/useDictionary";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
  const [confidentialityDialogOpen, setConfidentialityDialogOpen] = useState(false);
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
      setConfidentialityDialogOpen(true);
    } else if (option === "à propos") {
      setAboutDialogOpen(true);
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
    <>
      <Dialog open={confidentialityDialogOpen} onOpenChange={setConfidentialityDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-emerald-800">Politique de confidentialité</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4 text-gray-700">
              <h3 className="font-semibold text-emerald-700 text-lg">1. Introduction</h3>
              <p>
                L'application Dictionnaire Nzébi (« nous », « notre », « nos ») est une application mobile conçue pour fournir une ressource linguistique sur la langue inzèbi. Votre vie privée est de la plus haute importance.
              </p>
              <p>
                La présente politique de confidentialité vise à vous informer de la manière dont nous traitons vos données.
              </p>

              <h3 className="font-semibold text-emerald-700 text-lg mt-6">2. Absence de Collecte de Données Personnelles</h3>
              <p>
                Le Dictionnaire Nzébi est conçu pour fonctionner sans collecter, stocker, transmettre ou traiter aucune donnée personnelle de ses utilisateurs.
              </p>
              <p>
                Nous ne demandons ni n'enregistrons votre nom, votre adresse e-mail, votre localisation, vos identifiants d'appareil ou toute autre information permettant de vous identifier.
              </p>
              <p>
                L'application ne nécessite pas de connexion à un compte utilisateur.
              </p>
              <p>
                Toutes les recherches de mots et les fonctionnalités (comme les favoris ou l'historique) sont stockées localement sur votre propre appareil et ne sont jamais transmises à nos serveurs ou à des tiers.
              </p>

              <h3 className="font-semibold text-emerald-700 text-lg mt-6">3. Données Non-Personnelles</h3>
              <p>
                Nous n'utilisons aucun outil d'analyse tiers ni aucun service de suivi qui pourrait collecter des informations sur la manière dont vous utilisez l'application.
              </p>
              <p>
                Si, à l'avenir, nous décidions d'intégrer des outils d'analyse pour améliorer l'application (par exemple, pour savoir quelles fonctionnalités sont les plus utilisées), nous veillerons à ce que ces données soient :
              </p>
              <p>
                Anonymes et agrégées (ne permettant pas d'identifier un utilisateur individuel).
              </p>
              <p>
                Et nous mettrons à jour cette politique en conséquence.
              </p>

              <h3 className="font-semibold text-emerald-700 text-lg mt-6">4. Services Tiers</h3>
              <p>
                L'application est autonome et ne partage pas vos données avec des services tiers, des annonceurs ou des partenaires.
              </p>
              <p>
                Si l'application est disponible via une boutique (comme l'App Store d'Apple ou le Google Play Store), leurs politiques de confidentialité respectives régissent les données qu'ils pourraient collecter au moment du téléchargement.
              </p>

              <h3 className="font-semibold text-emerald-700 text-lg mt-6">5. Sécurité</h3>
              <p>
                Puisque nous ne collectons aucune donnée personnelle, le risque de fuite de données personnelles est nul. La sécurité de vos données est assurée par le fait même qu'elles ne quittent jamais votre appareil.
              </p>

              <h3 className="font-semibold text-emerald-700 text-lg mt-6">6. Contact</h3>
              <p>
                Si vous avez des questions concernant cette politique de confidentialité, vous pouvez nous contacter à l'adresse suivante :
              </p>
              <p className="font-semibold">
                languenzebiofficiel@gmail.com
              </p>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={aboutDialogOpen} onOpenChange={setAboutDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-emerald-800">À propos</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4 text-gray-700">
              <p>
                Le dictionnaire Nzébi-français est une application conçue pour préserver, valoriser et transmettre la langue et le patrimoine culturel de l'ethnie Nzébi du Gabon et du congo.
              </p>
              <p>
                Elle permet à tout utilisateur de découvrir des mots en langue nzébi, leur traduction en français, et dans certains cas, leur prononciation audio, afin d'en faciliter l'apprentissage et la mémorisation.
              </p>
              <p>
                Ce projet s'inscrit dans une démarche de sauvegarde des langues gabonaises minoritaires, souvent menacées de disparition à cause de l'exode rural, de la domination du français, et du vieillissement des locuteurs natifs.
              </p>

              <h3 className="font-semibold text-emerald-700 text-lg mt-6">Origine des données linguistiques</h3>
              <p>
                Les données de ce dictionnaire proviennent d'un travail existant, réalisé par: Luc de NADAILLAC, sous la forme d'un PDF librement accessible en ligne.
              </p>
              <p>
                Ce dictionnaire numérique ne prétend en aucun cas s'approprier ce travail. Au contraire, il vise à le valoriser, le diffuser et le rendre plus accessible, notamment aux jeunes générations.
              </p>
              <p>
                Nous reconnaissons et respectons la propriété intellectuelle de l'auteur initial, et l'application ne saurait exister sans sa contribution précieuse.
              </p>

              <h3 className="font-semibold text-emerald-700 text-lg mt-6">Qui sont les Nzébi ?</h3>
              <p>
                Les Nzébi (ou Ndzébi, parfois écrit Njebi) sont un peuple bantou du Gabon et du Congo-Brazzaville. Au Gabon, ils sont principalement présents dans le sud-est du pays.
              </p>

              <h4 className="font-semibold text-emerald-600 mt-4">Localisation</h4>
              <p>
                Ils sont installés dans la province du Haut-Ogooué (notamment autour de Franceville, Moanda, Bongoville) et aussi dans le sud de la Ngounié (Mbigou, Mandji, Lébamba, inounoushyabola, makongonio, Mouila).
              </p>
              <p>
                Le territoire nzébi se situe entre forêts équatoriales, plateaux sablonneux et zones minières, en bordure du fleuve Ogooué et de ses affluents.
              </p>

              <h4 className="font-semibold text-emerald-600 mt-4">Population</h4>
              <p>
                Leur population est estimée entre 50 000 et 70 000 personnes au Gabon, bien que beaucoup aient migré vers les villes comme Libreville ou Port-Gentil. Certains groupes Nzébi sont également présents au Congo-Brazzaville.
              </p>

              <h4 className="font-semibold text-emerald-600 mt-4">Histoire, culture et langue</h4>
              <p>
                Les Nzébi descendent de peuples bantous migrants, venus des rives du fleuve Congo.
              </p>
              <p>
                Ils sont réputés pour leur culture spirituelle riche, leurs rituels d'initiation (Bwiti, Mwiri, etc.), leurs masques traditionnels et leur oralité poétique.
              </p>
              <p>
                Leur langue, le nzébi, fait partie du groupe B.50 des langues bantoues, avec une grammaire complexe fondée sur les classes nominales et un système de tons.
              </p>
              <p>
                Cependant, cette langue est aujourd'hui en danger, menacée par la prédominance du français dans l'enseignement, les médias et la vie sociale. C'est pourquoi cette application souhaite contribuer, à son échelle, à la préservation de ce patrimoine linguistique précieux.
              </p>
              <p className="mt-6">
                En utilisant cette application, vous participez activement à la transmission de la langue nzébi. Merci de votre engagement et de votre curiosité.
              </p>
              <p className="font-semibold">
                Merci d'utiliser cette application et de soutenir la mission de Langue Nzébi Officiel. En diffusant et en pratiquant la langue nzébi, vous aidez à faire vivre un patrimoine culturel précieux.
              </p>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

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
    </>
  );
};

export default Index;
