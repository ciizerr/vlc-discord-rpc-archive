"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { MediaDetails } from "@/lib/api";

export default function MediaHero({ media }: { media: MediaDetails }) {
  const [isPlaying, setIsPlaying] = useState(false);

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
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100] bg-black"
          >
            <iframe
              src={`https://www.youtube.com/embed/${media.trailerKey}?autoplay=1&mute=0&controls=1&showinfo=0&rel=0&modestbranding=1`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full border-0"
            />
            <button
              onClick={() => setIsPlaying(false)}
              className="absolute top-8 right-8 z-50 p-3 bg-black/50 hover:bg-black/80 rounded-full text-white transition-all backdrop-blur shadow-lg hover:scale-110"
            >
              <X size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full">
        {/* Backdrop Section (Clear, not blurred) */}
        <div className="relative w-full h-[50vh] md:h-[65vh] bg-black border-b border-white/5 overflow-hidden">
          {media.backdropPath || media.posterPath ? (
            <div
              className={`absolute inset-0 bg-cover bg-center ${!media.trailerKey ? "blur-md scale-110 opacity-70" : ""}`}
              style={{ backgroundImage: `url(${media.backdropPath || media.posterPath})` }}
            />
          ) : null}
          {/* Gradient fades */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent opacity-80" />

          {/* Centered Play Button on Backdrop */}
          {media.trailerKey && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button
                onClick={() => setIsPlaying(true)}
                className="group relative pointer-events-auto w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white transition-all hover:bg-white/20 hover:scale-110 shadow-2xl"
              >
                <Play size={32} fill="currentColor" className="ml-1 opacity-90 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          )}
        </div>

        {/* Foreground Content: Poster overlapping the backdrop */}
        <div className="container mx-auto px-4 md:px-8 relative z-10 -mt-24 md:-mt-48 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 pb-12">
          {/* Vertical Poster */}
          {media.posterPath && (
            <div className="w-40 md:w-64 shrink-0 rounded-xl overflow-hidden shadow-2xl border border-white/10 relative aspect-[2/3] bg-zinc-900">
              <Image
                src={media.posterPath}
                alt={media.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 160px, 256px"
                priority
              />
            </div>
          )}

          {/* Metadata */}
          <div className="flex-1 text-center md:text-left drop-shadow-lg md:mb-4">
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-zinc-300 mb-2 font-medium">
              {media.releaseYear && <span>{media.releaseYear}</span>}
              {media.rating > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-zinc-200">
                    <span className="text-yellow-500">★</span>
                    {media.rating.toFixed(1)}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white">
              {media.title}
            </h1>
            {media.genres.length > 0 && (
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-sm mb-6">
                {media.genres.map((genre, i) => (
                  <span key={i} className="px-3 py-1 bg-white/5 backdrop-blur-md rounded-full text-zinc-300 border border-white/10">
                    {genre}
                  </span>
                ))}
              </div>
            )}
            <p className="text-sm md:text-lg text-zinc-300 max-w-3xl leading-relaxed line-clamp-4 md:line-clamp-none">
              {media.overview}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
