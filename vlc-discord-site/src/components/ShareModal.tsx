"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Link2, Eye } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function ShareModal({ isOpen, onClose, title }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => {
    if (typeof window !== "undefined") return window.location.href;
    return "";
  };

  const getOgImageUrl = () => {
    if (typeof window === "undefined") return "/api/og?type=home";
    const path = window.location.pathname;
    const parts = path.split("/").filter(Boolean);
    if (parts[0] === "movie" && parts[1]) {
      return `/api/og?type=movie&id=${parts[1]}`;
    }
    if (parts[0] === "show" && parts[1] && parts[2]) {
      return `/api/og?type=show&source=${parts[1]}&id=${parts[2]}`;
    }
    if (parts[0] === "person" && parts[1] && parts[2]) {
      return `/api/og?type=person&source=${parts[1]}&id=${parts[2]}`;
    }
    return "/api/og?type=home";
  };

  const currentUrl = getUrl();
  const ogImageUrl = getOgImageUrl();
  const mediaTitle = title || "VLC Discord RPC Media";

  const handleCopy = () => {
    if (currentUrl) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOptions = [
    {
      name: "X (Twitter)",
      handle: "@twitter",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      bg: "bg-white",
      text: "text-black",
      border: "border-transparent",
      onClick: () => {
        const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${mediaTitle} on VLC Discord RPC!`)}&url=${encodeURIComponent(currentUrl)}`;
        window.open(xUrl, "_blank", "noopener,noreferrer");
      },
    },
    {
      name: "Reddit",
      handle: "r/share",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.182 1.207.49 1.181-.842 2.822-1.404 4.632-1.488l.93-4.354 3.201.674a1.23 1.23 0 0 1 1.26-.824z" />
        </svg>
      ),
      bg: "bg-[#FF4500]",
      text: "text-white",
      border: "border-transparent",
      onClick: () => {
        const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(mediaTitle)}`;
        window.open(redditUrl, "_blank", "noopener,noreferrer");
      },
    },
    {
      name: "WhatsApp",
      handle: "wa.me",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      ),
      bg: "bg-[#25D366]",
      text: "text-white",
      border: "border-transparent",
      onClick: () => {
        const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${mediaTitle}: ${currentUrl}`)}`;
        window.open(waUrl, "_blank", "noopener,noreferrer");
      },
    },
    {
      name: "Telegram",
      handle: "t.me",
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
      bg: "bg-[#0088CC]",
      text: "text-white",
      border: "border-transparent",
      onClick: () => {
        const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(mediaTitle)}`;
        window.open(tgUrl, "_blank", "noopener,noreferrer");
      },
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#0d0d10] border border-white/[0.08] rounded-3xl p-6 shadow-[0_32px_80px_rgba(0,0,0,0.8)] relative overflow-hidden"
          >
            {/* Subtle top sheen */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/30 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-white font-bold text-base leading-tight">Share</h2>
                <p className="text-zinc-500 text-xs mt-0.5 max-w-[240px] truncate">{mediaTitle}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-white/[0.05] hover:bg-white/10 text-zinc-500 hover:text-white transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Open Graph Social Card Live Preview */}
            <div className="mb-5 flex flex-col gap-1.5">
              <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <Eye size={12} className="text-amber-400" />
                Social Card Preview
              </span>
              <div className="relative aspect-[1200/630] w-full rounded-2xl overflow-hidden border border-white/10 bg-zinc-950 shadow-xl group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ogImageUrl}
                  alt="Open Graph Preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="grid grid-cols-4 gap-3 mb-5">
              {shareOptions.map((opt) => (
                <button
                  key={opt.name}
                  onClick={opt.onClick}
                  className="group flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform"
                >
                  <div className={`w-12 h-12 rounded-2xl ${opt.bg} ${opt.text} flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:shadow-xl transition-all duration-200`}>
                    {opt.icon}
                  </div>
                  <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors font-medium">{opt.name}</span>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-white/[0.06]" />
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">or copy link</span>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>

            {/* Copy Link Row */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/[0.04] border border-white/[0.07]">
              <Link2 size={13} className="text-zinc-600 shrink-0 ml-1" />
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="bg-transparent text-xs text-zinc-400 flex-1 outline-none truncate"
              />
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 active:scale-95 ${
                  copied
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/25"
                }`}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
