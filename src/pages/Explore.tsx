
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { mockDictionary } from "@/data/mockDictionary";

const Explore = () => {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleCard = (wordId: string) => {
    const newExpandedCards = new Set(expandedCards);
    if (newExpandedCards.has(wordId)) {
      newExpandedCards.delete(wordId);
    } else {
      newExpandedCards.add(wordId);
    }
    setExpandedCards(newExpandedCards);
  };

  // Group words by category for better organization
  const wordsByCategory = mockDictionary.reduce((acc, word) => {
    const category = word.category || 'autres';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(word);
    return acc;
  }, {} as Record<string, typeof mockDictionary>);

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
            <h1 className="text-xl font-semibold text-gray-800">Explorer les mots</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-600 mb-6 text-center">
            Cliquez sur les mots Nzébi pour découvrir leur traduction française
          </p>

          {Object.entries(wordsByCategory).map(([category, words]) => (
            <div key={category} className="mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 capitalize flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  {category}
                </Badge>
                <span className="text-sm text-gray-500">({words.length} mots)</span>
              </h2>
              
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {words.map((word) => {
                  const isExpanded = expandedCards.has(word.id);
                  return (
                    <Card 
                      key={word.id} 
                      className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                        isExpanded ? 'ring-2 ring-indigo-200 shadow-lg' : ''
                      }`}
                      onClick={() => toggleCard(word.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {word.nzebi}
                          </h3>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        
                        {isExpanded && (
                          <div className="animate-fade-in space-y-3 border-t pt-3">
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-1">
                                Traduction française :
                              </p>
                              <p className="text-indigo-600 font-medium">
                                {word.french}
                              </p>
                            </div>
                            
                            {word.example && (
                              <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">
                                  Exemple :
                                </p>
                                <p className="text-sm text-gray-700 italic bg-gray-50 p-3 rounded-lg">
                                  "{word.example}"
                                </p>
                              </div>
                            )}
                            
                            <div className="flex justify-between items-center pt-2">
                              <Link to={`/word/${word.id}`}>
                                <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                                  Voir détails
                                </Button>
                              </Link>
                            </div>
                          </div>
                        )}
                        
                        {!isExpanded && (
                          <p className="text-sm text-gray-500">
                            Cliquez pour voir la traduction
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
