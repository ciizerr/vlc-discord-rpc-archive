"use client";

import { motion } from "framer-motion";
import { Star, Building2, Tag, DollarSign, Globe } from "lucide-react";
import type { MediaDetails } from "@/lib/api";

export default function MediaQuickStats({ media }: { media: MediaDetails }) {
  const stats = [
    {
      icon: <Star className="text-amber-400" size={20} />,
      label: "User Rating",
      value: media.rating > 0 ? `${media.rating.toFixed(1)} / 10` : "N/A",
      subtext: media.voteCount > 0 ? `${media.voteCount.toLocaleString()} votes` : "TMDb Score",
    },
    {
      icon: media.budget ? <DollarSign className="text-emerald-400" size={20} /> : <Globe className="text-sky-400" size={20} />,
      label: media.budget ? "Budget & Revenue" : "Format & Status",
      value: media.budget && media.revenue ? `${media.budget} / ${media.revenue}` : (media.status || "Released"),
      subtext: media.budget ? "Production Economics" : "Media Classification",
    },
    {
      icon: <Building2 className="text-purple-400" size={20} />,
      label: "Studios & Networks",
      value: media.networks.length > 0 ? media.networks[0] : "Independent",
      subtext: media.networks.length > 1 ? `+${media.networks.length - 1} co-producers` : "Production House",
    },
  ];

  return (
    <section className="container mx-auto px-4 md:px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl flex items-center gap-4 hover:border-white/20 transition-all hover:bg-white/[0.05]"
          >
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 shrink-0">
              {stat.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-lg font-bold text-white truncate">{stat.value}</h3>
              <p className="text-xs text-zinc-500 truncate">{stat.subtext}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Keywords Chips */}
      {media.keywords && media.keywords.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 flex items-center gap-2 flex-wrap text-xs"
        >
          <span className="text-zinc-500 flex items-center gap-1 font-medium mr-1">
            <Tag size={13} /> Topic Tags:
          </span>
          {media.keywords.map((kw, i) => (
            <span key={i} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-zinc-400 hover:text-white transition-colors cursor-default">
              #{kw}
            </span>
          ))}
        </motion.div>
      )}
    </section>
  );
}
