
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Volume2 } from "lucide-react";
import { mockDictionary } from "@/data/mockDictionary";

const Explore = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Filtering logic to search both Nzébi and French
  const filteredWords = useMemo(() => {
    if (!search.trim()) return mockDictionary;
    const lower = search.toLowerCase();
    return mockDictionary.filter(
      (w) =>
        w.nzebi.toLowerCase().includes(lower) ||
        w.french.toLowerCase().includes(lower)
    );
  }, [search]);

  // Sort alphabetically by Nzébi
  const sorted = useMemo(
    () => [...filteredWords].sort((a, b) => a.nzebi.localeCompare(b.nzebi)),
    [filteredWords]
  );

  const handleExpand = (id: string) => {
    setExpandedId((curr) => (curr === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-green-100 to-white flex flex-col px-0">
      {/* HEADER */}
      <header className="w-full py-6 bg-white shadow-sm sticky top-0 z-20">
        <h1 className="text-2xl sm:text-3xl text-green-800 font-bold text-center">
          Dictionnaire Nzébi–Français
        </h1>
      </header>
      {/* SEARCH */}
      <div className="flex justify-center w-full px-2">
        <div className="w-full max-w-xl mt-4 mb-6">
          <Input
            placeholder="Rechercher un mot en Nzébi ou en français…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-2 border-green-200 focus:border-green-500 rounded-xl bg-white shadow-sm transition-all"
          />
        </div>
      </div>
      {/* LIST */}
      <div className="w-full flex-1 max-w-2xl mx-auto pb-8">
        {sorted.length === 0 && (
          <p className="text-gray-500 text-center mt-8">Aucun mot trouvé.</p>
        )}
        <ul className="space-y-4 px-2">
          {sorted.map((word) => {
            const expanded = expandedId === word.id;
            return (
              <li key={word.id} className="list-none">
                <div
                  className={`bg-white rounded-2xl border border-green-100 shadow-md px-5 py-4 flex flex-col 
                  ${expanded ? "ring-2 ring-green-200" : ""}
                  transition-all cursor-pointer hover:shadow-lg`}
                  onClick={() => handleExpand(word.id)}
                  tabIndex={0}
                  aria-expanded={expanded}
                  role="button"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="text-lg sm:text-xl font-bold text-green-800">
                        {word.nzebi}
                      </span>
                      {/* Future: If audio, <button>…</button> */}
                      <Volume2 className="text-green-400 w-5 h-5 opacity-50" />
                    </span>
                    <span className="flex items-center gap-2">
                      {word.category && (
                        <Badge
                          variant="outline"
                          className="bg-green-50 border-green-200 text-green-700 font-semibold"
                        >
                          {word.category}
                        </Badge>
                      )}
                      {expanded ? (
                        <ChevronUp className="text-green-300 w-5 h-5" />
                      ) : (
                        <ChevronDown className="text-green-300 w-5 h-5" />
                      )}
                    </span>
                  </div>
                  <div
                    className={`transition-all overflow-hidden ${
                      expanded
                        ? "max-h-[300px] mt-2 opacity-100"
                        : "max-h-0 opacity-0 pointer-events-none"
                    }`}
                  >
                    <div className="pt-3 pb-2 px-1">
                      <div>
                        <p className="text-sm text-gray-600 font-semibold mb-1">
                          Français :
                        </p>
                        <div className="text-base sm:text-lg text-green-700 font-medium">
                          {word.french}
                        </div>
                      </div>
                      {word.example && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 font-semibold mb-1">
                            Exemple :
                          </p>
                          <div className="text-gray-700 text-sm italic bg-green-50 p-3 rounded-lg">
                            “{word.example}”
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Explore;
