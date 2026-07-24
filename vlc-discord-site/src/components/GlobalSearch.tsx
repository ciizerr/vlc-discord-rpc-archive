"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Search, X, Star, Loader2, Tv, Film, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

type SearchProvider = "tvmaze" | "tmdb";

interface SearchResultItem {
  id: string;
  title: string;
  posterPath: string | null;
  releaseYear: string;
  rating: number;
  url: string;
  provider: SearchProvider;
}

export default function GlobalSearch() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [provider, setProvider] = useState<SearchProvider>("tvmaze");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Listen for custom event to open search
  useEffect(() => {
    const handler = () => openSearch();
    window.addEventListener("open-search", handler);
    return () => window.removeEventListener("open-search", handler);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const inInput = ["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName);
      // Ctrl+K or Cmd+K — toggle
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        if (searchOpen) closeSearch(); else openSearch();
        return;
      }
      // / key — open search (not when typing in a field)
      if (e.key === "/" && !inInput && !searchOpen) {
        e.preventDefault();
        openSearch();
        return;
      }
      if (e.key === "Escape" && searchOpen) closeSearch();
    };
    window.addEventListener("keydown", handleKey);
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 80);
    return () => window.removeEventListener("keydown", handleKey);
  }, [searchOpen]);

  // Re-run search when provider changes (if query exists)
  useEffect(() => {
    if (searchQuery.trim()) executeSearch(searchQuery, provider);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  const openSearch = () => setSearchOpen(true);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const executeSearch = useCallback(async (query: string, prov: SearchProvider) => {
    if (!query.trim()) { setSearchResults([]); return; }
    setIsSearching(true);
    try {
      if (prov === "tvmaze") {
        const res = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query.trim())}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any[] = await res.json();
        setSearchResults(
          (data || []).slice(0, 10).map((item) => ({
            id: item.show.id.toString(),
            title: item.show.name,
            posterPath: item.show.image?.medium || item.show.image?.original || null,
            releaseYear: item.show.premiered ? item.show.premiered.substring(0, 4) : "",
            rating: item.show.rating?.average || 0,
            url: `/show/tvmaze/${item.show.id}`,
            provider: "tvmaze",
          }))
        );
      } else {
        interface TmdbResult { id: number; media_type: string; title?: string; name?: string; poster_path?: string; release_date?: string; first_air_date?: string; vote_average?: number; }
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setSearchResults(
          ((data.results || []) as TmdbResult[])
            .filter((r) => r.media_type === "movie" || r.media_type === "tv")
            .slice(0, 10)
            .map((r) => ({
              id: r.id.toString(),
              title: r.title || r.name || "Untitled",
              posterPath: r.poster_path ? `https://image.tmdb.org/t/p/w200${r.poster_path}` : null,
              releaseYear: (r.release_date || r.first_air_date || "").substring(0, 4),
              rating: r.vote_average || 0,
              url: r.media_type === "movie" ? `/movie/${r.id}` : `/show/tmdb/${r.id}`,
              provider: "tmdb",
            }))
        );
      }
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleSearchInput = (val: string) => {
    setSearchQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => executeSearch(val, provider), 800);
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[200] bg-black/75 backdrop-blur-md flex items-start justify-center pt-24 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) closeSearch(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -16 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full max-w-lg rounded-3xl bg-black/70 border border-white/20 shadow-2xl backdrop-blur-2xl overflow-hidden"
            style={{ WebkitBackdropFilter: "blur(32px)" }}
          >
            {/* Amber top sheen */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />

            {/* Search Input Row */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
              <Search size={18} className="text-amber-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder={provider === "tvmaze" ? "Search TV series on TVMaze..." : "Search movies & shows on TMDb..."}
                className="flex-1 bg-transparent text-white text-sm placeholder-zinc-500 focus:outline-none font-medium"
              />
              {isSearching && <Loader2 size={16} className="animate-spin text-amber-400 shrink-0" /> }
              <button
                onClick={closeSearch}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Results list */}
            <div className="max-h-72 overflow-y-auto">
              {searchResults.length === 0 && !isSearching && (
                <div className="py-10 text-center text-zinc-500 text-sm font-medium">
                  {searchQuery.trim()
                    ? `No results on ${provider === "tvmaze" ? "TVMaze" : "TMDb"}.`
                    : "Type a name to search…"}
                </div>
              )}
              {searchResults.map((item) => (
                <Link
                  key={`${item.provider}-${item.id}`}
                  href={item.url}
                  onClick={closeSearch}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.06] border-b border-white/5 last:border-b-0 transition-all group cursor-pointer"
                >
                  <div className="relative w-10 h-14 rounded-lg overflow-hidden bg-zinc-900 shrink-0 border border-white/10">
                    {item.posterPath ? (
                      <Image src={item.posterPath} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="40px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        {item.provider === "tmdb" ? <Film size={16} /> : <Tv size={16} />}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors truncate">{item.title}</h4>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-medium mt-0.5">
                      {item.releaseYear && <span>{item.releaseYear}</span>}
                      {item.rating > 0 && (
                        <span className="flex items-center gap-0.5 text-amber-300">
                          <Star size={9} fill="currentColor" />
                          {item.rating.toFixed(1)}
                        </span>
                      )}
                      <span className={`font-bold text-[10px] uppercase tracking-wider ${item.provider === "tvmaze" ? "text-cyan-400" : "text-amber-400"}`}>
                        {item.provider === "tvmaze" ? "TVMaze" : "TMDb"}
                      </span>
                    </div>
                  </div>
                  <span className="text-zinc-500 group-hover:text-amber-300 transition-colors text-xs">→</span>
                </Link>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-2.5 border-t border-white/10 flex items-center justify-between relative">
              <div className="relative">
                <button
                  id="provider-toggle"
                  onClick={() => setProvider(provider === "tvmaze" ? "tmdb" : "tvmaze")}
                  className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-white transition-colors cursor-pointer group"
                >
                  <span>Powered by</span>
                  <span className={`font-bold ${provider === "tvmaze" ? "text-cyan-400" : "text-amber-400"}`}>
                    {provider === "tvmaze" ? "TVMaze" : "TMDb"}
                  </span>
                  {provider === "tvmaze" ? <Tv size={10} className="text-cyan-400" /> : <Film size={10} className="text-amber-400" />}
                  <ChevronDown size={10} className="text-zinc-500 group-hover:text-white transition-colors" />
                </button>
              </div>
              <span className="flex items-center gap-2 text-[10px] text-zinc-500">
                <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-mono">Ctrl</kbd><span className="mx-0.5">+</span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-mono">K</kbd> to open</span>
                <span className="text-zinc-600">·</span>
                <span><kbd className="px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-mono">Esc</kbd> to close</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
