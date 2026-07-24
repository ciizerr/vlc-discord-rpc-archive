"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Building2, Tag, DollarSign, Film, Sparkles } from "lucide-react";
import type { MediaDetails } from "@/lib/api";

export default function MediaOverviewAndStats({ media }: { media: MediaDetails }) {
  const primaryStudioWithLogo = media.studioLogos?.find(s => s.logoPath) || null;

  const stats = [
    {
      icon: <Star className="text-amber-400" size={18} />,
      label: "User Rating",
      value: media.rating > 0 ? `${media.rating.toFixed(1)} / 10` : "N/A",
      subtext: media.voteCount > 0 ? `${media.voteCount.toLocaleString()} votes` : "TMDb Score",
    },
    {
      icon: <Film className="text-sky-400" size={18} />,
      label: "Format & Status",
      value: media.status || "Released",
      subtext: media.runtime ? `Runtime: ${media.runtime}` : "Media Format",
    },
    {
      icon: <Building2 className="text-purple-400" size={18} />,
      label: "Studio / Network",
      value: media.networks.length > 0 ? media.networks.join(", ") : "Independent",
      subtext: media.networks.length > 1 ? `+${media.networks.length - 1} co-producers` : "Production House",
      logo: primaryStudioWithLogo?.logoPath || null,
      studioName: primaryStudioWithLogo?.name || media.networks[0] || null,
    },
    ...(media.budget ? [{
      icon: <DollarSign className="text-emerald-400" size={18} />,
      label: "Budget & Revenue",
      value: `${media.budget} / ${media.revenue || 'N/A'}`,
      subtext: "Box Office Economics",
      logo: null,
      studioName: null,
    }] : []),
  ];

  return (
    <section className="container mx-auto px-4 md:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 Cols on Desktop - 66-70% width): Overview & Topic Tags */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="md:col-span-7 lg:col-span-8 flex flex-col justify-between"
        >
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight flex items-center gap-2">
              <Sparkles size={20} className="text-amber-400" />
              <span>Overview</span>
            </h2>

            {media.tagline && (
              <p className="text-xs sm:text-sm font-medium text-amber-300/90 italic mb-3">
                &ldquo;{media.tagline}&rdquo;
              </p>
            )}

            <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-normal mb-6 text-balance">
              {media.overview}
            </p>

            {/* Genre Chips */}
            {media.genres && media.genres.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-8">
                {media.genres.map((genre, i) => (
                  <span 
                    key={i} 
                    className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-default"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Topic Hashtag Chips */}
          {media.keywords && media.keywords.length > 0 && (
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-zinc-500 flex items-center gap-1 font-medium mr-1">
                  <Tag size={13} /> Topic Tags:
                </span>
                {media.keywords.map((kw, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-zinc-400 hover:text-white transition-colors cursor-default">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Right Column (4 Cols on Desktop - 33-35% width): Spacious Vertical Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="md:col-span-5 lg:col-span-4 flex flex-col gap-3.5"
        >
          {/* Stat Cards */}
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex items-center gap-4 hover:border-white/20 transition-all hover:bg-white/[0.05]"
            >
              {stat.logo ? (
                <div className="w-10 h-10 p-1.5 rounded-xl bg-white shrink-0 flex items-center justify-center overflow-hidden border border-white/20">
                  <Image
                    src={stat.logo}
                    alt={stat.studioName || "Studio"}
                    width={36}
                    height={36}
                    className="object-contain max-h-full"
                  />
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0">
                  {stat.icon}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-0.5">{stat.label}</p>
                <h4 className="text-sm font-bold text-white truncate">{stat.value}</h4>
                <p className="text-xs text-zinc-400 truncate">{stat.subtext}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
