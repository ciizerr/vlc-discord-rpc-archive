"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Share2, Sparkles, Download, Code, HelpCircle, FileText, ExternalLink, Search, Film } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ShareModal from "@/components/ShareModal";

interface MediaNavigationProps {
  title?: string;
  mediaType?: "movie" | "show";
  backToPrevious?: boolean;
  backHref?: string;
  backLabel?: string;
}



export default function MediaNavigation({ title, backToPrevious = false, backHref, backLabel }: MediaNavigationProps) {
  const router = useRouter();
  const [opacity, setOpacity] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [isVlcHovered, setIsVlcHovered] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setOpacity(Math.min(1, Math.max(0, currentScroll / 250)));
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsVlcHovered(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const openSearch = () => {
    window.dispatchEvent(new Event("open-search"));
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVlcHovered(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsVlcHovered(false), 200);
  };

  const handleBackClick = (e: React.MouseEvent) => {
    if (backToPrevious && typeof window !== "undefined" && window.history.length > 1) {
      e.preventDefault();
      router.back();
    }
  };

  const mainPageLinks = [
    { label: "Features", href: "/#features", icon: <Sparkles size={14} className="text-amber-400" /> },
    { label: "Try it", href: "/#try-it", icon: <Film size={14} className="text-cyan-400" /> },
    { label: "Install", href: "/#installation", icon: <Download size={14} className="text-emerald-400" /> },
    { label: "Changelog", href: "/#changelog", icon: <FileText size={14} className="text-purple-400" /> },
    { label: "FAQ", href: "/#faq", icon: <HelpCircle size={14} className="text-sky-400" /> },
    { label: "Source Code", href: "https://github.com/ciizerr/vlc-discord-rpc-archive", icon: <Code size={14} className="text-zinc-400" />, external: true },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 w-full pt-3 sm:pt-4 pb-8 sm:pb-12 pointer-events-none">
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/50 to-transparent pointer-events-none transition-opacity duration-75"
          style={{ opacity }}
        />

        <div className="container mx-auto px-3 sm:px-4 md:px-8 flex items-center justify-between pointer-events-auto relative z-10 gap-2">
          {/* Left: Back / Home + Share */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link
              href={backHref ?? "/"}
              onClick={backHref ? undefined : handleBackClick}
              className="flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-black/50 hover:bg-white/15 border border-white/10 text-white/90 hover:text-white transition-all text-xs sm:text-sm font-medium backdrop-blur-md group cursor-pointer"
            >
              <ArrowLeft size={16} className="shrink-0 group-hover:-translate-x-1 transition-transform" />
              <span className="max-w-[110px] xs:max-w-[160px] sm:max-w-none truncate">{backLabel ?? (backToPrevious ? "Back" : "Home")}</span>
            </Link>

            <button
              onClick={() => setShareOpen(true)}
              className="group flex items-center gap-0 hover:gap-2 px-2.5 py-1.5 rounded-full bg-black/50 hover:bg-white/15 border border-white/10 text-white/90 hover:text-white transition-all duration-300 backdrop-blur-md overflow-hidden active:scale-95 cursor-pointer"
              title="Share"
              aria-label="Share"
            >
              <Share2 size={16} className="shrink-0" />
              <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-300 ease-out text-sm font-medium whitespace-nowrap overflow-hidden">
                Share
              </span>
            </button>
          </div>

          {/* Center/Right: Search trigger — visible on mobile & desktop */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={openSearch}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-black/50 hover:bg-white/15 border border-white/10 hover:border-amber-400/30 text-white/90 hover:text-white transition-all backdrop-blur-md cursor-pointer active:scale-95 group"
              aria-label="Open Search"
              title="Search (Ctrl+K or /)"
            >
              <Search size={14} className="text-amber-400 shrink-0" />
              <span className="hidden sm:inline text-xs font-semibold text-zinc-300 group-hover:text-white">Search</span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/10 group-hover:bg-white/15 border border-white/10 text-[10px] font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors">
                Ctrl K
              </kbd>
            </button>

            {/* Right: VLC logo + dropdown */}
            <div
              ref={menuRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsVlcHovered((prev) => !prev);
                }}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-black/50 hover:bg-white/15 border border-white/10 text-white/90 hover:text-white transition-all backdrop-blur-md group cursor-pointer"
                aria-label="VLC RPC Menu"
              >
                <div className="relative w-5 h-5 group-hover:scale-110 transition-transform shrink-0">
                  <Image src="/assets/vlc-discord-icon.png" alt="VLC Discord RPC" fill className="object-contain" sizes="20px" />
                </div>
                <span className="text-xs font-bold hidden sm:inline tracking-tight">VLC RPC</span>
              </button>

              <AnimatePresence>
                {isVlcHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-52 p-2 rounded-2xl bg-black/80 border border-white/20 shadow-[0_8px_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-50 overflow-hidden"
                    style={{ WebkitBackdropFilter: "blur(32px)" }}
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                    <div className="px-3 py-1.5 mb-1 border-b border-white/10">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block">Quick Links</span>
                    </div>
                    <div className="space-y-0.5">
                      {mainPageLinks.map((link, i) => (
                        <Link
                          key={i}
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          rel={link.external ? "noopener noreferrer" : undefined}
                          onClick={() => setIsVlcHovered(false)}
                          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/10 transition-all group"
                        >
                          <span className="flex items-center gap-2">{link.icon}{link.label}</span>
                          {link.external && <ExternalLink size={12} className="text-zinc-500 group-hover:text-white" />}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>



      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} title={title} />
    </>
  );
}
