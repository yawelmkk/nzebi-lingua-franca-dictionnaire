
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mockDictionary } from "@/data/mockDictionary";

const Explore = () => {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filtrer les mots selon la recherche (Nzébi ou FR)
  const filteredWords = useMemo(() => {
    if (!search.trim()) return mockDictionary;
    const lower = search.toLowerCase();
    return mockDictionary.filter(
      (w) =>
        w.nzebi.toLowerCase().includes(lower) ||
        w.french.toLowerCase().includes(lower)
    );
  }, [search]);

  // Trier alphabétiquement (Nzébi)
  const sorted = useMemo(
    () => [...filteredWords].sort((a, b) => a.nzebi.localeCompare(b.nzebi)),
    [filteredWords]
  );

  // Afficher la traduction/fr quand le mot est cliqué
  const handleExpand = (id: string) => {
    setExpandedId((curr) => (curr === id ? null : id));
  };

  // Recherche avec bouton (pour mobiles)
  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // On ne fait rien de spécial ici, le filtre est déjà actif sur la search
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center
        bg-gradient-to-br from-blue-50 via-purple-50 to-violet-100 py-0 px-0"
      style={{ minHeight: "100dvh" }} // mobile safe
    >
      {/* Champ de recherche centré */}
      <form
        onSubmit={onFormSubmit}
        className="w-full flex justify-center"
        autoComplete="off"
        role="search"
      >
        <div
          className="
            flex w-full max-w-xl mt-12 mb-10 items-center px-2 gap-2
            rounded-xl bg-white/60 shadow
            border border-[#e8e8fd]
          "
        >
          <span className="pl-2 pr-1 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="7" strokeWidth="2"/><path strokeWidth="2" d="M21 21l-4.35-4.35"/></svg>
          </span>
          <Input
            placeholder="Rechercher un mot…"
            className="flex-1 bg-transparent border-none focus:ring-0 text-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Rechercher un mot"
          />
          <Button
            type="submit"
            className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-md font-semibold text-base shadow-none"
          >
            Rechercher
          </Button>
        </div>
      </form>

      {/* Liste de mots simplifiée */}
      <div className="w-full max-w-xl px-2">
        {sorted.length === 0 && (
          <p className="text-center text-gray-400 mt-16 text-lg">
            Aucun mot trouvé.
          </p>
        )}
        <ul className="space-y-3">
          {sorted.map((word) => {
            const expanded = expandedId === word.id;
            return (
              <li
                key={word.id}
                className="
                  bg-white rounded-xl p-0 border border-[#ebeafc] shadow
                  hover:bg-violet-50 transition-all cursor-pointer
                  "
                onClick={() => handleExpand(word.id)}
                tabIndex={0}
                aria-expanded={expanded}
                role="button"
              >
                <div className="flex items-center justify-between px-4 py-4">
                  <span className="text-lg sm:text-xl font-semibold text-violet-700">
                    {word.nzebi}
                  </span>
                </div>
                {/* Animation pour la traduction */}
                <div
                  className={`transition-all duration-200 overflow-hidden px-4 ${
                    expanded
                      ? "max-h-32 py-2 opacity-100"
                      : "max-h-0 py-0 opacity-0 pointer-events-none"
                  }`}
                  style={{ background: "#f4f3ff" }}
                >
                  <div className="text-gray-800 text-base font-medium">
                    {word.french}
                  </div>
                  {word.example && (
                    <div className="text-gray-500 text-sm italic mt-1">“{word.example}”</div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
        <div className="h-20" /> {/* Pour espace bas mobile */}
      </div>
    </div>
  );
};

export default Explore;
