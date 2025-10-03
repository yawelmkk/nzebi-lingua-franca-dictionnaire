import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Volume2, BookOpen, FileText, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { DictionaryWord } from "@/hooks/useDictionary";

interface WordCardProps {
  word: DictionaryWord;
  showDetailsButton?: boolean;
}

export const WordCard = ({ word, showDetailsButton = false }: WordCardProps) => {
  const handlePlayAudio = () => {
    // Placeholder for audio functionality
    alert("Fonctionnalité audio à venir !");
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header with word and audio */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-foreground" translate="no">
                  {word.nzebi_word}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePlayAudio}
                  className="h-8 w-8 p-0"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>

              {/* French translation */}
              <p className="text-lg text-muted-foreground mb-3" translate="no">
                {word.french_word}
              </p>

              {/* Part of speech badge */}
              {word.part_of_speech && (
                <Badge variant="default" className="mb-4">
                  {word.part_of_speech}
                </Badge>
              )}
            </div>

            {showDetailsButton && (
              <Link to={`/word/${word.id}`}>
                <Button variant="outline" size="sm">
                  Détails
                </Button>
              </Link>
            )}
          </div>

          {/* Example section */}
          {(word.example_nzebi || word.example_french) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 border border-current rounded-sm" />
                <span className="font-medium">Exemple</span>
              </div>
              {word.example_nzebi && (
                <p className="text-sm italic text-foreground pl-6" translate="no">
                  {word.example_nzebi}
                </p>
              )}
              {word.example_french && (
                <p className="text-sm text-muted-foreground pl-6">
                  {word.example_french}
                </p>
              )}
            </div>
          )}

          {/* Plural form */}
          {word.plural_form && (
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Forme plurielle : <span className="text-foreground font-medium" translate="no">{word.plural_form}</span>
              </span>
            </div>
          )}

          {/* Imperative */}
          {word.imperative && (
            <div className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Impératif : <span className="text-foreground font-medium" translate="no">{word.imperative}</span>
              </span>
            </div>
          )}

          {/* Synonyms */}
          {word.synonyms && (
            <div className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Synonymes : <span className="text-foreground font-medium" translate="no">{word.synonyms}</span>
              </span>
            </div>
          )}

          {/* Scientific name */}
          {word.scientific_name && (
            <div className="text-sm">
              <span className="text-muted-foreground">
                Nom scientifique : <span className="text-foreground italic font-medium" translate="no">{word.scientific_name}</span>
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
