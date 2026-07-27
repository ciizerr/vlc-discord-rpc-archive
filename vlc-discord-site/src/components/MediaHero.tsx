"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Play, X, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { MediaDetails } from "@/lib/api";

function getRatingDescription(rating?: string | null): string {
  if (!rating) return "Age Certification Rating";
  const r = rating.toUpperCase().trim();
  if (r === "TV-MA") return "Mature Audience Only — Intended for adults (17+). May contain intense violence, sexual content, or strong language.";
  if (r === "R") return "Restricted — Under 17 requires accompanying parent or adult guardian.";
  if (r === "PG-13") return "Parents Strongly Cautioned — Some material may be inappropriate for children under 13.";
  if (r === "PG") return "Parental Guidance Suggested — Some material may not be suitable for children.";
  if (r === "TV-14") return "Parents Strongly Cautioned — Intended for viewers 14 and older.";
  if (r === "TV-PG") return "Parental Guidance Suggested — Contains material parents may find unsuitable for younger children.";
  if (r === "G" || r === "TV-G") return "General Audience — Suitable for all ages.";
  if (r === "NC-17") return "No One 17 and Under Admitted — Explicit content.";
  if (r === "TV-Y7") return "Directed to Older Children — Suitable for children age 7 and older.";
  if (r === "TV-Y") return "Suitable for All Children — Designed specifically for a young audience.";
  return `${r} — Age Certification Rating`;
}

export default function MediaHero({ media }: { media: MediaDetails }) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Backdrop carousel selection
  const backdrops = useMemo(() => {
    return (media.backdrops && media.backdrops.length > 0)
      ? media.backdrops.slice(0, 8)
      : (media.backdropPath ? [media.backdropPath] : (media.posterPath ? [media.posterPath] : []));
  }, [media.backdrops, media.backdropPath, media.posterPath]);

  const [currentBackdropIndex, setCurrentBackdropIndex] = useState(0);

  // Idle staggered background preloading (Zero network congestion on page load)
  useEffect(() => {
    if (typeof window === "undefined" || !backdrops || backdrops.length <= 1) return;

    // 1. Preload NEXT image (#1) immediately so first transition is 100% ready
    if (backdrops[1]) {
      const nextImg = new window.Image();
      nextImg.src = backdrops[1];
    }

    // 2. Preload remaining images lazily during browser idle time
    const preloadOthers = () => {
      backdrops.slice(2).forEach((url, i) => {
        setTimeout(() => {
          if (url) {
            const img = new window.Image();
            img.src = url;
          }
        }, i * 1000); // Stagger by 1s each
      });
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(preloadOthers, { timeout: 3000 });
      return () => window.cancelIdleCallback(idleId);
    } else {
      const timer = setTimeout(preloadOthers, 2000);
      return () => clearTimeout(timer);
    }
  }, [backdrops]);

  useEffect(() => {
    if (backdrops.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBackdropIndex((prev) => (prev + 1) % backdrops.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [backdrops.length]);

  const directorName = media.directors?.length > 0 ? media.directors[0].name : null;
  const primaryStudio = media.networks?.length > 0 ? media.networks[0] : null;

  return (
    <>
      {/* Fullscreen Video Overlay */}
      <AnimatePresence>
        {isPlaying && media.trailerKey && (
          <motion.div
            key="video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
          >
            {/* Close Trailer Button */}
            <button
              onClick={() => setIsPlaying(false)}
              className="fixed top-6 right-6 md:top-8 md:right-8 z-[110] p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all backdrop-blur-md border border-white/20 shadow-2xl hover:scale-110 active:scale-95"
              aria-label="Close Trailer"
            >
              <X size={24} />
            </button>

            <div className="relative w-full max-w-6xl aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <iframe
                src={`https://www.youtube.com/embed/${media.trailerKey}?autoplay=1&mute=0&controls=1&showinfo=0&rel=0&modestbranding=1`}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full overflow-hidden pb-8">
        {/* Dynamic Looping Backdrop */}
        <div className="relative w-full h-[55vh] md:h-[65vh] bg-black overflow-hidden">
          <AnimatePresence mode="popLayout">
            {backdrops.length > 0 && (
              <motion.div
                key={backdrops[currentBackdropIndex]}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1.12 }}
                exit={{ opacity: 0, scale: 1.15 }}
                transition={{
                  opacity: { duration: 2.0, ease: "easeInOut" },
                  scale: { duration: 8.5, ease: "linear" },
                }}
                className={`absolute inset-0 bg-cover bg-center ${!media.trailerKey ? "blur-md opacity-60" : ""}`}
                style={{ backgroundImage: `url(${backdrops[currentBackdropIndex]})` }}
              />
            )}
          </AnimatePresence>

          {/* Vignette & Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

          {/* Centered Cinematic Play Button */}
          {media.trailerKey && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.button
                onClick={() => setIsPlaying(true)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="group pointer-events-auto w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/25 text-white transition-all hover:bg-black/80 hover:border-amber-400/60 shadow-xl"
                aria-label="Play Trailer"
              >
                <Play size={20} fill="currentColor" className="ml-0.5 text-white/90 group-hover:text-white transition-colors" />
              </motion.button>
            </div>
          )}
        </div>

        {/* Foreground Media Header Card */}
        <div className="container mx-auto px-4 md:px-8 relative z-10 -mt-36 md:-mt-48 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
          {/* Poster Image Card */}
          {media.posterPath && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-40 md:w-56 shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/15 relative aspect-[2/3] bg-zinc-950 group"
            >
              <Image
                src={media.posterPath}
                alt={media.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 160px, 224px"
                priority
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
            </motion.div>
          )}

          {/* Info Block */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex-1 text-center md:text-left drop-shadow-xl md:mb-1 w-full"
          >
            {/* Top Subtitle Line: Type • Year • Duration */}
            <div className="text-xs md:text-sm font-semibold text-zinc-400 mb-1.5 flex items-center justify-center md:justify-start gap-2">
              <span>{media.mediaType === "movie" ? "Movie" : "TV Series"}</span>
              {media.releaseYear && <span>&bull; {media.releaseYear}</span>}
              {media.runtime && <span>&bull; {media.runtime}</span>}
            </div>

            {/* Title Line with Inline Streaming Badge */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                {media.title}
              </h1>

              {media.watchUrl && (
                <a
                  href={media.watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-amber-500/20 border border-white/15 hover:border-amber-400/40 text-xs font-semibold text-amber-300 hover:text-amber-200 transition-all backdrop-blur-md group/stream hover:scale-105 active:scale-95 shadow-md"
                  title={`Stream on ${primaryStudio || "Official Platform"}`}
                >
                  <span>{primaryStudio || "Stream"}</span>
                  <ExternalLink size={12} className="group-hover/stream:translate-x-0.5 group-hover/stream:-translate-y-0.5 transition-transform text-amber-400" />
                </a>
              )}
            </div>

            {/* Key Metadata Row (Expanded Flexible Row with Zero Truncation) */}
            <div className="flex flex-wrap items-start gap-x-8 gap-y-3 text-xs max-w-4xl w-full justify-center md:justify-start">
              {directorName && (
                <div className="min-w-fit">
                  <span className="block text-zinc-500 font-medium mb-0.5">
                    {media.mediaType === "movie" ? "Directed By" : "Created By"}
                  </span>
                  <span className="font-bold text-white text-sm whitespace-nowrap block">{directorName}</span>
                </div>
              )}
              {primaryStudio && (
                <div className="min-w-fit">
                  <span className="block text-zinc-500 font-medium mb-0.5">Studio / Network</span>
                  <span className="font-bold text-white text-sm whitespace-nowrap block">{primaryStudio}</span>
                </div>
              )}
              {(media.country || media.language) && (
                <div className="min-w-fit">
                  <span className="block text-zinc-500 font-medium mb-0.5">Country & Language</span>
                  <span className="font-bold text-white text-sm whitespace-nowrap block">
                    {[media.country, media.language].filter(Boolean).join(" • ")}
                  </span>
                </div>
              )}
              {(media.contentRating || media.imdbId) && (
                <div className="min-w-fit">
                  <span className="block text-zinc-500 font-medium mb-0.5">Rating & IMDb</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    {/* Rating Badge with Hover Explanation Popover */}
                    {media.contentRating && (
                      <div className="relative group/rating inline-block">
                        <span 
                          className="px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/35 text-amber-300 text-[11px] font-bold cursor-help transition-colors hover:bg-amber-500/30 block"
                        >
                          {media.contentRating}
                        </span>
                        
                        {/* Hover Rating Explanation Popover */}
                        <div className="absolute left-0 bottom-full mb-2.5 hidden group-hover/rating:block z-50 w-64 p-3 rounded-xl bg-zinc-950/95 border border-amber-500/40 backdrop-blur-xl shadow-2xl text-[11px] text-zinc-200 pointer-events-none animate-in fade-in slide-in-from-bottom-1 duration-200">
                          <p className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            {media.contentRating} Rating Meaning
                          </p>
                          <p className="text-zinc-300 leading-snug">{getRatingDescription(media.contentRating)}</p>
                        </div>
                      </div>
                    )}

                    {media.imdbId && (
                      <a
                        href={`https://www.imdb.com/title/${media.imdbId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/35 text-yellow-300 text-[11px] font-bold transition-all"
                        title="View on IMDb"
                      >
                        <span>IMDb</span>
                        <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
