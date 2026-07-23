"use client";

import Link from "next/link";
import Image from "next/image";
import { Github, ExternalLink, ArrowUp } from "lucide-react";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Install", href: "/#installation" },
  { label: "Changelog", href: "/#changelog" },
  { label: "FAQ", href: "/#faq" },
];

export default function MediaFooter() {
  return (
    <footer className="relative w-full z-10 overflow-hidden bg-black">
      {/* Top border fade */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* ── End Card Hero ── */}
      <div className="relative flex flex-col items-center justify-center pt-20 pb-14 px-6 text-center overflow-hidden">
        {/* Large ambient radial glow behind the icon */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_0%,rgba(251,191,36,0.07),transparent)] pointer-events-none" />

        {/* Huge background word */}
        <span
          aria-hidden
          className="absolute top-4 left-1/2 -translate-x-1/2 text-[min(28vw,220px)] font-black text-white/[0.025] select-none leading-none tracking-tight whitespace-nowrap pointer-events-none"
        >
          VLC RPC
        </span>

        {/* Icon */}
        <div className="relative mb-5 group">
          <div className="absolute inset-0 blur-2xl bg-amber-400/20 rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Image
            src="/assets/vlc-discord-icon.png"
            alt="VLC Discord RPC"
            width={56}
            height={56}
            className="relative rounded-2xl shadow-2xl group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Brand name */}
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
          VLC Discord RPC
        </h2>

        {/* Tagline */}
        <p className="text-zinc-500 text-sm max-w-xs mb-8 leading-relaxed">
          Your watching activity, beautifully shown on Discord.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link
            href="/#installation"
            className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-sm transition-all active:scale-95 shadow-lg shadow-amber-400/20"
          >
            Get Started
          </Link>
          <a
            href="https://github.com/ciizerr/vlc-discord-rpc-archive"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-bold text-sm transition-all active:scale-95"
          >
            <Github size={15} />
            GitHub
          </a>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-6 md:mx-16" />

      {/* ── Bottom Strip ── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-5 px-6 md:px-16 py-6">

        {/* Nav pills */}
        <nav className="flex items-center flex-wrap justify-center gap-1.5">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="px-3 py-1 rounded-full text-[11px] font-semibold text-zinc-500 hover:text-white hover:bg-white/8 border border-transparent hover:border-white/10 transition-all"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Attribution pills */}
        <div className="flex items-center gap-2 text-[10px] text-zinc-600">
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/8 border border-emerald-500/15 text-emerald-500 hover:text-emerald-300 transition-colors font-bold"
          >
            TMDb <ExternalLink size={9} />
          </a>
          <span>·</span>
          <a
            href="https://www.tvmaze.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-500/8 border border-sky-500/15 text-sky-500 hover:text-sky-300 transition-colors font-bold"
          >
            TVMaze <ExternalLink size={9} />
          </a>
        </div>

        {/* Copyright + scroll top */}
        <div className="flex items-center gap-4 text-[11px] text-zinc-600">
          <span>© {new Date().getFullYear()} VLC Discord RPC</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1 hover:text-white transition-colors group cursor-pointer"
          >
            Top
            <ArrowUp size={11} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
