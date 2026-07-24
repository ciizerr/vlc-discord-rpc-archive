"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Tv, Star, Clock, Calendar } from "lucide-react";
import { SeasonInfo, EpisodeCardInfo } from "@/lib/api";

interface MediaEpisodesProps {
  showId: string;
  source: 'tmdb' | 'tvmaze';
  seasons: SeasonInfo[];
  seasonNumber?: number;
  initialEpisodes?: EpisodeCardInfo[];
  activeEpisodeNumber?: number;
  hideSeasonTabs?: boolean;
}

export default function MediaEpisodes({
  showId,
  source,
  seasons,
  seasonNumber,
  initialEpisodes = [],
  activeEpisodeNumber,
  hideSeasonTabs = false,
}: MediaEpisodesProps) {
  const validSeasons = seasons.filter(s => s.episodeCount > 0 || (s.seasonNumber !== undefined && s.seasonNumber >= 0));
  const seasonList = validSeasons.length > 0 ? validSeasons : seasons;

  const defaultSeason = seasonNumber !== undefined 
    ? seasonNumber 
    : (seasonList[0]?.seasonNumber ?? 1);

  const [selectedSeasonNumber, setSelectedSeasonNumber] = useState<number | null>(null);

  const activeSeasonNumber = hideSeasonTabs && seasonNumber !== undefined 
    ? seasonNumber 
    : (selectedSeasonNumber ?? defaultSeason);

  const [episodes, setEpisodes] = useState<EpisodeCardInfo[]>(initialEpisodes);
  const [loading, setLoading] = useState<boolean>(() => initialEpisodes.length === 0);

  const handleSeasonChange = (sNum: number) => {
    setSelectedSeasonNumber(sNum);
    setLoading(true);
  };

  useEffect(() => {
    // If initial episodes were supplied for the active season and no tab switch occurred yet, skip fetch
    if (selectedSeasonNumber === null && initialEpisodes.length > 0) {
      return;
    }

    let isMounted = true;

    fetch(`/api/episodes?source=${source}&showId=${showId}&season=${activeSeasonNumber}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          setEpisodes(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Failed to load season episodes:", err);
        if (isMounted) {
          setEpisodes([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [showId, source, activeSeasonNumber, initialEpisodes.length, selectedSeasonNumber]);

  if (seasonList.length === 0 && seasonNumber === undefined) return null;

  return (
    <section className="container mx-auto px-4 md:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <Tv size={20} className="text-cyan-400" />
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {hideSeasonTabs ? `Season Episodes` : `Episodes & Seasons`}
          </h2>
          {episodes.length > 0 && (
            <span className="text-xs font-medium text-zinc-500">({episodes.length})</span>
          )}
        </div>

        {/* Season Selector Tabs (Hidden when hideSeasonTabs is true) */}
        {!hideSeasonTabs && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {seasonList.map((season, idx) => {
              const sNum = season.seasonNumber ?? (idx + 1);
              const isActive = activeSeasonNumber === sNum;

              return (
                <button
                  key={season.id || idx}
                  onClick={() => handleSeasonChange(sNum)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap active:scale-95 cursor-pointer ${
                    isActive
                      ? "bg-amber-400 text-black shadow-lg shadow-amber-400/20"
                      : "bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-300 hover:text-white"
                  }`}
                >
                  {season.name || `Season ${sNum}`}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Episode Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="aspect-video w-full rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : episodes.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-white/[0.03] border border-white/10 text-zinc-400 text-sm">
          No episodes found for this season.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {episodes.map((ep, idx) => {
            const epUrl = `/show/${source}/${showId}/season/${ep.seasonNumber}/episode/${ep.episodeNumber}`;
            const isCurrentActive = activeEpisodeNumber === ep.episodeNumber;

            return (
              <motion.div
                key={ep.id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.4) }}
              >
                <Link
                  href={epUrl}
                  className={`flex flex-col group rounded-2xl overflow-hidden bg-white/[0.03] border transition-all p-3 hover:bg-white/[0.06] ${
                    isCurrentActive
                      ? "border-amber-400 ring-2 ring-amber-400/30 bg-amber-400/5"
                      : "border-white/10 hover:border-amber-400/50 shadow-md hover:shadow-2xl"
                  }`}
                >
                  {/* Episode Still Screenshot Container */}
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-900 mb-3 border border-white/10 group-hover:scale-[1.02] transition-transform duration-300">
                    {ep.stillPath ? (
                      <Image
                        src={ep.stillPath}
                        alt={ep.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600">
                        <Tv size={36} />
                      </div>
                    )}

                    {/* Season / Episode Badge */}
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-extrabold text-amber-300">
                      S{ep.seasonNumber < 10 ? `0${ep.seasonNumber}` : ep.seasonNumber} E{ep.episodeNumber < 10 ? `0${ep.episodeNumber}` : ep.episodeNumber}
                    </div>

                    {/* Rating Badge */}
                    {ep.voteAverage > 0 && (
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 flex items-center gap-1 text-[11px] font-bold text-amber-300">
                        <Star size={10} fill="currentColor" />
                        {ep.voteAverage.toFixed(1)}
                      </div>
                    )}
                  </div>

                  {/* Episode Details */}
                  <div className="flex flex-col flex-1">
                    <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors leading-tight mb-1 truncate">
                      {ep.title}
                    </h3>

                    {ep.overview && (
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3 font-normal">
                        {ep.overview}
                      </p>
                    )}

                    <div className="mt-auto pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-medium text-zinc-500">
                      {ep.runtime && (
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-zinc-400" />
                          {ep.runtime}
                        </span>
                      )}
                      {ep.airDate && (
                        <span className="flex items-center gap-1">
                          <Calendar size={11} className="text-zinc-400" />
                          {ep.airDate}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
