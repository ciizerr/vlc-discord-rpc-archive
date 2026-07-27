"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, History, Star, ChevronLeft, ChevronRight } from "lucide-react";
import type { MediaRecommendation } from "@/lib/api";

interface RecentItem {
  id: string;
  title: string;
  posterPath: string | null;
  releaseYear: string;
  mediaType: "movie" | "show";
  source: "tmdb" | "tvmaze";
  url: string;
}

interface MediaDiscoveryProps {
  recommendations?: MediaRecommendation[];
  currentMedia?: {
    id: string;
    title: string;
    posterPath: string | null;
    releaseYear: string;
    mediaType: "movie" | "show";
    source: "tmdb" | "tvmaze";
  };
}

export default function MediaDiscoveryCarousel({ recommendations = [], currentMedia }: MediaDiscoveryProps) {
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const recentScrollRef = useRef<HTMLDivElement>(null);

  const [canRecentLeft, setCanRecentLeft] = useState(false);
  const [canRecentRight, setCanRecentRight] = useState(false);

  const checkRecentScroll = useCallback(() => {
    const el = recentScrollRef.current;
    if (!el) return;
    setCanRecentLeft(el.scrollLeft > 5);
    setCanRecentRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  }, []);

  const handleRecentScroll = (direction: 'left' | 'right') => {
    if (recentScrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      recentScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function syncRecent() {
      // 1. Prepare current item if viewing media
      let newItem: RecentItem | null = null;
      if (currentMedia) {
        const currentUrl = currentMedia.mediaType === "movie"
          ? `/movie/${currentMedia.id}`
          : `/show/${currentMedia.source}/${currentMedia.id}`;

        newItem = {
          id: currentMedia.id,
          title: currentMedia.title,
          posterPath: currentMedia.posterPath,
          releaseYear: currentMedia.releaseYear,
          mediaType: currentMedia.mediaType,
          source: currentMedia.source,
          url: currentUrl,
        };

        // Post to global server API
        try {
          fetch("/api/recent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newItem),
          }).catch(() => { });
        } catch {
          // ignore post failure
        }
      }

      // 2. Fetch global recent list from server API
      try {
        const res = await fetch("/api/recent", { cache: "no-store" });
        if (res.ok) {
          const globalItems: RecentItem[] = await res.json();
          if (isMounted && Array.isArray(globalItems) && globalItems.length > 0) {
            setRecentItems(globalItems);
            // Save to localStorage as backup
            try {
              localStorage.setItem("vlc_rpc_recent_media", JSON.stringify(globalItems.slice(0, 10)));
            } catch { }
            return;
          }
        }
      } catch {
        // Fallback to local storage below if network fails
      }

      // 3. Fallback to localStorage
      try {
        const stored = localStorage.getItem("vlc_rpc_recent_media");
        let list: RecentItem[] = stored ? JSON.parse(stored) : [];
        if (newItem) {
          list = [newItem, ...list.filter(i => i.url !== newItem?.url)].slice(0, 10);
          localStorage.setItem("vlc_rpc_recent_media", JSON.stringify(list));
        }
        if (isMounted) setRecentItems(list);
      } catch { }
    }

    syncRecent();

    return () => {
      isMounted = false;
    };
  }, [currentMedia]);

  useEffect(() => {
    const el = recentScrollRef.current;
    checkRecentScroll();

    if (el) el.addEventListener("scroll", checkRecentScroll, { passive: true });
    window.addEventListener("resize", checkRecentScroll, { passive: true });

    return () => {
      if (el) el.removeEventListener("scroll", checkRecentScroll);
      window.removeEventListener("resize", checkRecentScroll);
    };
  }, [recentItems, checkRecentScroll]);

  if (recommendations.length === 0 && recentItems.length === 0) return null;

  return (
    <section className="container mx-auto px-4 md:px-8 py-12 border-t border-white/10">
      {/* Recently Viewed Carousel */}
      {recentItems.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <History size={20} className="text-sky-400" />
              <h2 className="text-2xl font-bold text-white tracking-tight">Recent Activity</h2>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Visitor Feed</span>
            </div>
          </div>

          <div className="relative group/carousel">
            {/* Left Floating Arrow with Disappear Animation */}
            <AnimatePresence>
              {canRecentLeft && (
                <motion.button
                  key="recent-left"
                  initial={{ opacity: 0, scale: 0.8, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onClick={() => handleRecentScroll('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/75 hover:bg-black/95 border border-white/20 text-white backdrop-blur-md shadow-2xl hover:scale-110 active:scale-95 cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={20} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Right Floating Arrow with Disappear Animation */}
            <AnimatePresence>
              {canRecentRight && (
                <motion.button
                  key="recent-right"
                  initial={{ opacity: 0, scale: 0.8, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onClick={() => handleRecentScroll('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/75 hover:bg-black/95 border border-white/20 text-white backdrop-blur-md shadow-2xl hover:scale-110 active:scale-95 cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={20} />
                </motion.button>
              )}
            </AnimatePresence>

            <div
              ref={recentScrollRef}
              className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x scroll-smooth px-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {recentItems.map((item) => (
                <Link
                  key={item.url}
                  href={item.url}
                  className="w-36 sm:w-44 shrink-0 snap-start group"
                >
                  <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-zinc-900 mb-2 border border-white/10 group-hover:border-sky-400/50 transition-all shadow-lg group-hover:scale-105 duration-300">
                    {item.posterPath ? (
                      <Image
                        src={item.posterPath}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="176px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-zinc-600 bg-zinc-900 p-2 text-center">
                        {item.title}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-white group-hover:text-sky-300 transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium">
                    {item.mediaType === "movie" ? "Movie" : "Show"} &bull; {item.releaseYear}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recommended Discovery Carousel */}
      {recommendations.length > 0 && (
        <div>
          <div className="flex items-center gap-2.5 mb-6">
            <Compass size={20} className="text-amber-400" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Discover Similar Titles</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {recommendations.map((item, index) => {
              const targetUrl = item.mediaType === "movie"
                ? `/movie/${item.id}`
                : `/show/${item.source}/${item.id}`;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: (index % 5) * 0.06 }}
                >
                  <Link href={targetUrl} className="flex flex-col group">
                    <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-zinc-900 mb-2 border border-white/10 group-hover:border-amber-400/50 transition-all shadow-lg group-hover:scale-105 duration-300">
                      {item.posterPath ? (
                        <Image
                          src={item.posterPath}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 20vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-zinc-600 bg-zinc-900 p-2 text-center">
                          {item.title}
                        </div>
                      )}
                      {item.voteAverage > 0 && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-1 text-[11px] font-bold text-amber-300">
                          <Star size={10} fill="currentColor" />
                          {item.voteAverage.toFixed(1)}
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium">
                      {item.mediaType === "movie" ? "Movie" : "Show"} &bull; {item.releaseYear}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
