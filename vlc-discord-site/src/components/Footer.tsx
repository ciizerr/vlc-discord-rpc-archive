"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative mt-32">
            {/* ── CTA Banner ────────────────────────── */}
            <div className="border-t border-white/[0.06]">
                <div className="max-w-6xl mx-auto px-6 py-20 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
                        Ready to show off what you&apos;re watching?
                    </h2>
                    <p className="text-[15px] text-[#71717a] max-w-md mx-auto mb-8">
                        Install the mod in under a minute. No bloatware, no background processes.
                    </p>
                    <Link
                        href="https://windhawk.net/mods/vlc-discord-rpc"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF9500] hover:bg-[#e68600] text-[#09090b] text-[14px] font-semibold rounded-md transition-all duration-200 hover:shadow-[0_0_30px_rgba(255,149,0,0.3)]"
                    >
                        Get VLC RPC
                        <ArrowRight size={16} strokeWidth={2.5} />
                    </Link>
                </div>
            </div>

            {/* ── Bottom Bar ────────────────────────── */}
            <div className="border-t border-white/[0.06]">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-[#52525b]">
                        {/* Left: Brand + License */}
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#71717a]">VLC RPC</span>
                            <span>·</span>
                            <span>&copy; {new Date().getFullYear()} MIT License</span>
                        </div>

                        {/* Center: Links */}
                        <div className="flex items-center gap-4 flex-wrap justify-center">
                            <Link
                                href="https://github.com/ciizerr/vlc-discord-rpc-archive"
                                target="_blank"
                                className="hover:text-[#a1a1aa] transition-colors"
                            >
                                GitHub
                            </Link>
                            <span className="text-white/[0.1]">·</span>
                            <Link
                                href="https://discord.com/servers/windhawk-923944342991818753"
                                target="_blank"
                                className="hover:text-[#a1a1aa] transition-colors"
                            >
                                Discord
                            </Link>
                            <span className="text-white/[0.1]">·</span>
                            <Link
                                href="https://windhawk.net"
                                target="_blank"
                                className="hover:text-[#a1a1aa] transition-colors"
                            >
                                Windhawk
                            </Link>
                            <span className="text-white/[0.1]">·</span>
                            <Link
                                href="https://github.com/ciizerr/vlc-discord-rpc-archive/issues"
                                target="_blank"
                                className="hover:text-[#a1a1aa] transition-colors"
                            >
                                Issues
                            </Link>
                            <span className="text-white/[0.1]">·</span>
                            <Link
                                href="https://github.com/ciizerr/vlc-discord-rpc-archive"
                                target="_blank"
                                className="hover:text-[#a1a1aa] transition-colors"
                            >
                                ⭐ Star on GitHub
                            </Link>
                        </div>

                        {/* Right: Author */}
                        <div>
                            <span>Made by </span>
                            <Link
                                href="https://github.com/ciizerr"
                                target="_blank"
                                className="text-[#71717a] hover:text-[#FF9500] transition-colors"
                            >
                                ciizerr
                            </Link>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-center text-[11px] text-[#3f3f46] mt-4">
                        Not affiliated with VideoLAN, Discord, or Windhawk. All trademarks are property of their respective owners.
                    </p>
                </div>
            </div>
        </footer>
    );
}
