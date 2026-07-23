"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Share2, MessageCircle, Send } from "lucide-react";

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

  const currentUrl = getUrl();
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
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      color: "bg-white/10 hover:bg-white/20 text-white border border-white/10",
      onClick: () => {
        const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${mediaTitle} on VLC Discord RPC!`)}&url=${encodeURIComponent(currentUrl)}`;
        window.open(xUrl, "_blank", "noopener,noreferrer");
      },
    },
    {
      name: "Reddit",
      icon: (
        <svg className="w-4 h-4 fill-current text-orange-500" viewBox="0 0 24 24">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.182 1.207.49 1.181-.842 2.822-1.404 4.632-1.488l.93-4.354 3.201.674a1.23 1.23 0 0 1 1.26-.824z" />
        </svg>
      ),
      color: "bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20",
      onClick: () => {
        const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(mediaTitle)}`;
        window.open(redditUrl, "_blank", "noopener,noreferrer");
      },
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle size={16} className="text-emerald-400" />,
      color: "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20",
      onClick: () => {
        const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${mediaTitle}: ${currentUrl}`)}`;
        window.open(waUrl, "_blank", "noopener,noreferrer");
      },
    },
    {
      name: "Telegram",
      icon: <Send size={16} className="text-sky-400" />,
      color: "bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/20",
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
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-zinc-950 border border-white/15 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Share2 size={18} className="text-amber-400" />
                <span>Share Media</span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-zinc-400 mb-5">
              Share <span className="font-semibold text-zinc-200">{mediaTitle}</span> across social platforms or copy link for Discord.
            </p>

            {/* Copy Link Input Bar */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10 mb-6">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="bg-transparent text-xs text-zinc-300 px-2 flex-1 outline-none truncate"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all shrink-0 active:scale-95"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? "Copied!" : "Copy"}</span>
              </button>
            </div>

            {/* Social Share Grid */}
            <div className="grid grid-cols-2 gap-3">
              {shareOptions.map((opt) => (
                <button
                  key={opt.name}
                  onClick={opt.onClick}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${opt.color} active:scale-95`}
                >
                  {opt.icon}
                  <span>{opt.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
