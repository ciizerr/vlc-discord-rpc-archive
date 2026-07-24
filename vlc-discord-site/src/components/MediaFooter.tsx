"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ArrowUp } from "lucide-react";
import { GithubIcon, DiscordIcon } from "./BrandIcons";

const quickLinks = [
  { label: "Features", href: "/#features" },
  { label: "Install", href: "/#installation" },
  { label: "Changelog", href: "/#changelog" },
  { label: "FAQ", href: "/#faq" },
];

const supportLinks = [
  {
    label: "GitHub",
    href: "https://github.com/ciizerr/vlc-discord-rpc-archive",
    icon: <GithubIcon size={14} />,
    color: "text-zinc-400 hover:text-white",
    bg: "hover:bg-white/[0.06]",
  },
  {
    label: "Discord",
    href: "https://discord.com/servers/windhawk-923944342991818753",
    icon: <DiscordIcon size={14} />,
    color: "text-indigo-400 hover:text-indigo-300",
    bg: "hover:bg-indigo-500/[0.08]",
  },
  {
    label: "Report Issue",
    href: "https://github.com/ciizerr/vlc-discord-rpc-archive/issues",
    icon: <ExternalLink size={13} />,
    color: "text-zinc-500 hover:text-zinc-300",
    bg: "hover:bg-white/[0.04]",
  },
  {
    label: "Windhawk",
    href: "https://windhawk.net/mods/vlc-discord-rpc",
    icon: <Image src="/assets/windhawk.svg" alt="Windhawk" width={15} height={15} />,
    color: "text-amber-500 hover:text-amber-300",
    bg: "hover:bg-amber-500/[0.06]",
  },
];

export default function MediaFooter() {
  return (
    <footer className="relative w-full z-10 bg-black/60 backdrop-blur-sm">
      {/* Top ambient glow line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">

          {/* Left: Branding */}
          <div className="flex flex-col gap-4 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="absolute inset-0 bg-amber-400/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <Image
                  src="/assets/vlc-discord-icon.png"
                  alt="VLC Discord RPC"
                  width={32}
                  height={32}
                  className="relative rounded-xl group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <span className="font-bold text-sm text-white/80 group-hover:text-white transition-colors tracking-tight">VLC Discord RPC</span>
            </Link>
            <p className="text-[12px] text-zinc-600 leading-relaxed max-w-[180px]">
              Native Rich Presence mod for VLC. Built on Windhawk. <br /> With 💙 by <strong>ciizerr</strong>.
            </p>
            {/* Attribution pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href="https://www.themoviedb.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 hover:text-emerald-300 transition-colors"
              >
                TMDb <ExternalLink size={8} />
              </a>
              <a
                href="https://www.tvmaze.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-500/10 border border-sky-500/20 text-[10px] font-bold text-sky-500 hover:text-sky-300 transition-colors"
              >
                TVMaze <ExternalLink size={8} />
              </a>
            </div>
          </div>

          {/* Center: Quick Nav */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-600">Navigate</span>
            <nav className="flex flex-col gap-2">
              {quickLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-[13px] text-zinc-500 hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Support & Community */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-600">Support</span>
            <div className="flex flex-col gap-1">
              {supportLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium ${link.color} ${link.bg} transition-all`}
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-5 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-zinc-700">
            © {new Date().getFullYear()} VLC Discord RPC · MIT License · Not affiliated with VideoLAN or Discord
          </span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-white transition-colors group cursor-pointer"
          >
            Back to top
            <ArrowUp size={11} className="group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
