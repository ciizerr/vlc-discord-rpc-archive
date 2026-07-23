"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Layers, Tv } from "lucide-react";
import type { SeasonInfo } from "@/lib/api";

interface MediaSeasonsProps {
  showId: string;
  source: 'tmdb' | 'tvmaze';
  seasons: SeasonInfo[];
}

export default function MediaSeasons({ showId, source, seasons }: MediaSeasonsProps) {
  if (!seasons || seasons.length === 0) return null;

  return (
    <section className="container mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center gap-2.5 mb-6">
        <Layers size={20} className="text-amber-400" />
        <h2 className="text-2xl font-bold text-white tracking-tight">Seasons ({seasons.length})</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {seasons.map((season, idx) => {
          const sNum = season.seasonNumber ?? (idx + 1);
          const seasonUrl = `/show/${source}/${showId}/season/${sNum}`;

          return (
            <motion.div
              key={season.id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Link href={seasonUrl} className="flex flex-col group cursor-pointer">
                <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-900 mb-3 shadow-md border border-white/10 group-hover:border-amber-400/50 transition-all group-hover:shadow-2xl group-hover:scale-105">
                  {season.posterPath ? (
                    <Image
                      src={season.posterPath}
                      alt={season.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, 16vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      <Tv size={36} />
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors truncate">
                  {season.name}
                </h3>
                <p className="text-xs text-zinc-400 truncate font-medium">
                  {season.episodeCount > 0 ? `${season.episodeCount} Episodes` : 'Season'} {season.airDate ? `• ${season.airDate}` : ''}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
