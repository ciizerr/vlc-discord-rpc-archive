"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Share2, Sparkles, Download, Code, HelpCircle, FileText, ExternalLink, Search, X, Star, Loader2, Tv, Film, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ShareModal from "@/components/ShareModal";

interface MediaNavigationProps {
  title?: string;
  mediaType?: "movie" | "show";
  backToPrevious?: boolean;
}

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

export default function MediaNavigation({ title, backToPrevious = false }: MediaNavigationProps) {
  const router = useRouter();
  const [opacity, setOpacity] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [isVlcHovered, setIsVlcHovered] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [provider, setProvider] = useState<SearchProvider>("tvmaze");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setOpacity(Math.min(1, Math.max(0, currentScroll / 250)));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen for custom event from MediaFallbackCard
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
        const tmdbKey = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";
        const res = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${tmdbKey}&query=${encodeURIComponent(query.trim())}&include_adult=false`
        );
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
    debounceRef.current = setTimeout(() => executeSearch(val, provider), 380);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVlcHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsVlcHovered(false), 200);
  };

  const handleBackClick = (e: React.MouseEvent) => {
    if (backToPrevious && typeof window !== "undefined" && window.history.length > 1) {
      e.preventDefault();
      router.back();
    }
  };

  const mainPageLinks = [
    { label: "Features", href: "/#features", icon: <Sparkles size={14} className="text-amber-400" /> },
    { label: "Try it", href: "/#try-it", icon: <Film size={14} className="text-cyan-400" /> },
    { label: "Install", href: "/#installation", icon: <Download size={14} className="text-emerald-400" /> },
    { label: "Changelog", href: "/#changelog", icon: <FileText size={14} className="text-purple-400" /> },
    { label: "FAQ", href: "/#faq", icon: <HelpCircle size={14} className="text-sky-400" /> },
    { label: "Source Code", href: "https://github.com/ciizerr/vlc-discord-rpc-archive", icon: <Code size={14} className="text-zinc-400" />, external: true },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 w-full pt-4 pb-12 pointer-events-none">
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/50 to-transparent pointer-events-none transition-opacity duration-75"
          style={{ opacity }}
        />

        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between pointer-events-auto relative z-10">
          {/* Left: Back / Home + Share */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              onClick={handleBackClick}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-white/15 border border-white/10 text-white/90 hover:text-white transition-all text-sm font-medium backdrop-blur-md group cursor-pointer"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>{backToPrevious ? "Back" : "Home"}</span>
            </Link>

            <button
              onClick={() => setShareOpen(true)}
              className="group flex items-center gap-0 hover:gap-2 px-2.5 py-1.5 rounded-full bg-black/40 hover:bg-white/15 border border-white/10 text-white/90 hover:text-white transition-all duration-300 backdrop-blur-md overflow-hidden active:scale-95 cursor-pointer"
              title="Share"
              aria-label="Share"
            >
              <Share2 size={16} className="shrink-0" />
              <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300 ease-out text-sm font-medium whitespace-nowrap overflow-hidden">
                Share
              </span>
            </button>
          </div>

          {/* Center: Search trigger — icon + Ctrl K badge */}
          <button
            onClick={openSearch}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-white/15 border border-white/10 hover:border-amber-400/30 text-white/90 hover:text-white transition-all backdrop-blur-md cursor-pointer active:scale-95 group"
            aria-label="Open Search (Ctrl+K)"
            title="Search (Ctrl+K or /)"
          >
            <Search size={14} className="text-amber-400 shrink-0" />
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/10 group-hover:bg-white/15 border border-white/10 text-[10px] font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors">
              Ctrl K
            </kbd>
          </button>

          {/* Right: VLC logo + dropdown */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 hover:bg-white/15 border border-white/10 text-white/90 hover:text-white transition-all backdrop-blur-md group"
            >
              <div className="relative w-5 h-5 group-hover:scale-110 transition-transform">
                <Image src="/assets/vlc-discord-icon.png" alt="VLC Discord RPC" fill className="object-contain" sizes="20px" />
              </div>
              <span className="text-xs font-bold hidden sm:inline tracking-tight">VLC RPC</span>
            </Link>

            <AnimatePresence>
              {isVlcHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-52 p-2 rounded-2xl bg-black/60 border border-white/20 shadow-[0_8px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl z-50 overflow-hidden"
                  style={{ WebkitBackdropFilter: "blur(32px)" }}
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                  <div className="px-3 py-1.5 mb-1 border-b border-white/10">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block">Quick Links</span>
                  </div>
                  <div className="space-y-0.5">
                    {mainPageLinks.map((link, i) => (
                      <Link
                        key={i}
                        href={link.href}
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-all group"
                      >
                        <span className="flex items-center gap-2">{link.icon}{link.label}</span>
                        {link.external && <ExternalLink size={12} className="text-zinc-500 group-hover:text-white" />}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ── Search Modal Overlay ── */}
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
                {isSearching && <Loader2 size={16} className="animate-spin text-amber-400 shrink-0" />}
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

              {/* Footer: provider dropdown + Esc hint */}
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

      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} title={title} />
    </>
  );
}
