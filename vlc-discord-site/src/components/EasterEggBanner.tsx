"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Instagram, ExternalLink, Sparkles } from "lucide-react";

const MAX_MSG_LENGTH = 80;
const MAX_IG_LENGTH = 30; // Instagram username max

function sanitize(str: string, max: number): string {
  return str.replace(/[<>"'`]/g, "").slice(0, max);
}

export default function EasterEggBanner() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const rawMsg = searchParams.get("msg") || "";
  const rawIg = searchParams.get("ig") || "";

  const msg = sanitize(rawMsg, MAX_MSG_LENGTH);
  const ig = sanitize(rawIg, MAX_IG_LENGTH);

  const hasContent = msg.length > 0 || ig.length > 0;

  useEffect(() => {
    if (hasContent) {
      // Small delay so it appears after page load animations
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, [hasContent]);

  useEffect(() => {
    if (hasContent && visible && !isHovered && !collapsed) {
      const t = setTimeout(() => setCollapsed(true), 5000);
      return () => clearTimeout(t);
    }
  }, [hasContent, visible, isHovered, collapsed]);

  if (!hasContent) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          layout
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(10px)" }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className={`fixed z-[100] bottom-6 right-4 left-4 md:left-auto md:right-8 md:w-full pointer-events-none flex justify-end ${collapsed ? 'md:max-w-fit' : 'md:max-w-sm'}`}
        >
          {/* Animated Glow Backdrop */}
          {!collapsed && (
            <motion.div layout className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 blur-lg rounded-full opacity-40 animate-pulse pointer-events-none" />
          )}

          <motion.div 
            layout
            onMouseEnter={() => {
              setIsHovered(true);
              if (collapsed) setCollapsed(false);
            }}
            onMouseLeave={() => setIsHovered(false)}
            className="relative rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden group pointer-events-auto"
          >
            {/* Top sheen */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Dynamic Left Accent */}
            {!collapsed && (
              <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-amber-400 via-pink-500 to-purple-500 opacity-80" />
            )}

            {collapsed ? (
              <div 
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
                title="Hover to expand"
              >
                {msg && <Sparkles size={18} className="text-amber-400 drop-shadow-md" />}
                {ig && <Instagram size={18} className="text-pink-400 drop-shadow-md" />}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-3 px-5 py-4"
              >
                {/* Message section */}
                {msg && (
                  <div className="flex items-start gap-3 w-full pr-6">
                    <div className="mt-0.5 p-2 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/10 border border-amber-400/20 shrink-0 shadow-[0_0_15px_rgba(251,191,36,0.15)] group-hover:shadow-[0_0_20px_rgba(251,191,36,0.25)] transition-shadow">
                      <Sparkles size={16} className="text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400/80 mb-1">
                        Special Message
                      </p>
                      <p className="text-[14px] font-medium text-white/90 leading-snug break-words">
                        {msg}
                      </p>
                    </div>
                  </div>
                )}

                {/* Divider */}
                {msg && ig && (
                  <div className="h-px bg-white/10 w-full" />
                )}

                {/* Instagram card */}
                {ig && (
                  <div className="flex items-center gap-3 shrink-0 w-full bg-white/[0.02] hover:bg-white/[0.04] transition-colors p-2.5 rounded-xl border border-white/5 group/ig cursor-pointer" onClick={() => window.open(`https://instagram.com/${ig}`, '_blank')}>
                    <div className="p-2 rounded-lg bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] shadow-lg shadow-pink-500/20 group-hover/ig:scale-110 transition-transform duration-300">
                      <Instagram size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-pink-400/80 mb-0.5">
                        Instagram
                      </p>
                      <div className="flex items-center gap-1.5 text-sm font-bold text-white group/link">
                        @{ig}
                        <ExternalLink size={12} className="opacity-0 -ml-2 group-hover/ig:opacity-100 group-hover/ig:ml-0 transition-all text-pink-400" />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Dismiss button */}
            {!collapsed && (
              <button
                onClick={() => setVisible(false)}
                className="absolute top-3 right-3 p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-all cursor-pointer backdrop-blur-md z-10"
                aria-label="Dismiss"
              >
                <X size={14} />
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
