"use client";

import { motion } from "framer-motion";
import type { MediaDetails } from "@/lib/api";

export default function MediaOverview({ media }: { media: MediaDetails }) {
  if (!media.overview) return null;

  return (
    <section className="container mx-auto px-4 md:px-8 py-6">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl"
      >
        <h2 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight">Overview</h2>
        
        {media.tagline && (
          <p className="text-xs sm:text-sm font-medium text-amber-300/90 italic mb-3">
            &ldquo;{media.tagline}&rdquo;
          </p>
        )}

        <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-normal mb-5 text-balance">
          {media.overview}
        </p>

        {media.genres && media.genres.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {media.genres.map((genre, i) => (
              <span 
                key={i} 
                className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-default"
              >
                {genre}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </section>
  );
}
