"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { RefreshCw, ArrowLeft, KeyRound, Clock, Compass, Tv, AlertCircle, Search } from "lucide-react";

interface MediaFallbackCardProps {
  type: 'movie_traffic' | 'tmdb_show_missing' | 'tvmaze_show_missing' | 'episode_missing';
  errorDetail?: 'invalid_api_key' | 'rate_limited' | 'not_found' | 'heavy_traffic';
  showTitle?: string;
}

export default function MediaFallbackCard({ type, errorDetail, showTitle }: MediaFallbackCardProps) {
  const isInvalidKey = errorDetail === 'invalid_api_key';
  const isRateLimited = errorDetail === 'rate_limited';

  const [countdown, setCountdown] = useState(3);
  const [reloadPaused, setReloadPaused] = useState(false);

  useEffect(() => {
    if (!isRateLimited || reloadPaused) return;
    if (countdown <= 0) { window.location.reload(); return; }
    const t = setTimeout(() => setCountdown((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [isRateLimited, countdown, reloadPaused]);

  const openHeaderSearch = () => {
    setReloadPaused(true);
    window.dispatchEvent(new Event("open-search"));
  };

  const getConfig = () => {
    if (isInvalidKey) return {
      accent: "from-red-500/20 via-transparent",
      ring: "border-red-500/30",
      glow: "bg-red-500/10",
      badge: "bg-red-500/10 border-red-500/25 text-red-400",
      badgeText: "API Key Error",
      Icon: KeyRound,
      iconBg: "bg-red-500/10 text-red-400 ring-red-500/20",
      title: "Invalid TMDb API Key",
      description: "The TMDb API key for this site isn't working. Search via TVMaze or TMDb using the button below.",
    };
    if (isRateLimited) return {
      accent: "from-amber-500/20 via-transparent",
      ring: "border-amber-500/30",
      glow: "bg-amber-500/10",
      badge: reloadPaused ? "bg-amber-500/10 border-amber-500/25 text-amber-400" : "bg-amber-400/15 border-amber-400/35 text-amber-300 animate-pulse",
      badgeText: reloadPaused ? "Rate Limited" : `Retrying in ${countdown}s…`,
      Icon: Clock,
      iconBg: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
      title: "Too Many Requests",
      description: `The data provider is temporarily overwhelmed. ${reloadPaused ? "Click Refresh to try again." : `Auto-reloading in ${countdown} second${countdown !== 1 ? "s" : ""}…`}`,
    };
    if (type === "movie_traffic") return {
      accent: "from-amber-500/15 via-transparent",
      ring: "border-amber-500/20",
      glow: "bg-amber-500/8",
      badge: "bg-amber-500/10 border-amber-500/25 text-amber-400",
      badgeText: "Slow Response",
      Icon: AlertCircle,
      iconBg: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
      title: "Movie Info Taking Too Long",
      description: "The movie database is responding slowly right now. Wait a moment, then try refreshing.",
    };
    if (type === "episode_missing") return {
      accent: "from-zinc-500/15 via-transparent",
      ring: "border-zinc-500/20",
      glow: "bg-zinc-500/8",
      badge: "bg-zinc-700/30 border-zinc-600/30 text-zinc-400",
      badgeText: "Episodes Missing",
      Icon: Tv,
      iconBg: "bg-zinc-700/20 text-zinc-400 ring-zinc-600/20",
      title: "No Episodes Listed",
      description: showTitle
        ? `Episode data for "${showTitle}" hasn't been added by the provider yet.`
        : "Episode details for this season aren't available yet.",
    };
    return {
      accent: "from-cyan-500/15 via-transparent",
      ring: "border-cyan-500/20",
      glow: "bg-cyan-500/8",
      badge: "bg-cyan-500/10 border-cyan-500/25 text-cyan-400",
      badgeText: "Not Found",
      Icon: Compass,
      iconBg: "bg-cyan-500/10 text-cyan-400 ring-cyan-500/20",
      title: "Not Found on This Source",
      description: `This title isn't listed on ${type === "tmdb_show_missing" ? "TMDb" : "TVMaze"}. Try searching across both providers.`,
    };
  };

  const cfg = getConfig();
  const { Icon } = cfg;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className={`relative w-full max-w-sm overflow-hidden rounded-3xl bg-zinc-950/90 border ${cfg.ring} shadow-2xl backdrop-blur-xl`}
        style={{ WebkitBackdropFilter: "blur(24px)" }}
      >
        {/* Top accent gradient */}
        <div className={`absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${cfg.accent} pointer-events-none`} />
        {/* Ambient glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-40 pointer-events-none ${cfg.glow}`} />
        {/* Top sheen */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center p-8 gap-5">
          {/* Badge */}
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider border ${cfg.badge}`}>
            {cfg.badgeText}
          </span>

          {/* Icon */}
          <div className={`w-16 h-16 rounded-2xl ring-1 flex items-center justify-center shadow-lg ${cfg.iconBg}`}>
            <Icon size={30} strokeWidth={1.5} />
          </div>

          {/* Title + description */}
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white tracking-tight">{cfg.title}</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">{cfg.description}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2.5 w-full mt-1">
            <button
              onClick={openHeaderSearch}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm transition-all backdrop-blur-md active:scale-95 cursor-pointer"
            >
              <Search size={15} />
              Search
            </button>

            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-5 rounded-full bg-white/[0.06] hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white font-semibold text-sm transition-all cursor-pointer"
            >
              <RefreshCw size={14} />
              {isRateLimited && !reloadPaused ? `Refresh (${countdown}s)` : "Refresh"}
            </button>
          </div>

          {/* Pause auto-reload */}
          {isRateLimited && !reloadPaused && (
            <button
              onClick={() => setReloadPaused(true)}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 underline transition-colors"
            >
              Pause Auto-Reload
            </button>
          )}

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white font-medium transition-colors mt-1"
          >
            <ArrowLeft size={12} />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
