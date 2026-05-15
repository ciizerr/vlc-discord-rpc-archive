"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink, Heart, Globe, ShieldCheck, Zap } from "lucide-react";
import { DiscordIcon, GithubIcon } from "./BrandIcons";
import { motion } from "framer-motion";

export default function Footer() {
    return (
        <footer className="relative mt-32 overflow-hidden">
            {/* ── Premium CTA Banner ────────────────────────── */}
            <div className="relative max-w-6xl mx-auto px-6 mb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative bg-gradient-to-br from-[#111113] to-[#09090b] border border-white/[0.08] rounded-[2.5rem] p-10 md:p-20 text-center overflow-hidden group shadow-2xl"
                >
                    {/* Animated Glow Background */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[#FF9500]/[0.03] blur-[120px] pointer-events-none" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF9500]/10 border border-[#FF9500]/20 text-[#FF9500] text-[11px] font-bold uppercase tracking-wider mb-8">
                            <Zap size={14} />
                            Instant Setup
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                            Ready to transform your <br />
                            <span className="text-[#FF9500]">Discord presence?</span>
                        </h2>
                        <p className="text-[16px] md:text-[18px] text-[#71717a] max-w-lg mx-auto mb-10 leading-relaxed">
                            Join thousands of users sharing their VLC media status with zero performance impact. Engineered for Windows.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="https://windhawk.net/mods/vlc-discord-rpc"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-[#FF9500] hover:bg-[#e68600] text-[#09090b] text-[15px] font-bold rounded-2xl transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,149,0,0.4)] hover:scale-[1.02]"
                            >
                                Get VLC RPC
                                <ArrowRight size={18} strokeWidth={2.5} />
                            </Link>
                            <Link
                                href="https://github.com/ciizerr/vlc-discord-rpc-archive"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-white/[0.03] border border-white/[0.08] text-white text-[15px] font-bold rounded-2xl transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.15]"
                            >
                                <GithubIcon size={18} />
                                Star on Github
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ── Main Footer Grid ────────────────────────── */}
            <div className="border-t border-white/[0.06] pt-20 pb-12 bg-[#09090b]/50 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
                        {/* Brand Column */}
                        <div className="col-span-2 lg:col-span-2">
                            <Link href="/" className="flex items-center gap-3 mb-6 group">
                                <Image
                                    src="/assets/vlc-discord-icon.png"
                                    alt="VLC RPC"
                                    width={32}
                                    height={32}
                                    className="object-contain"
                                />
                                <span className="font-bold text-lg tracking-tight text-white group-hover:text-[#FF9500] transition-colors">
                                    VLC RPC
                                </span>
                            </Link>
                            <p className="text-[14px] text-[#52525b] leading-relaxed max-w-sm mb-8">
                                A high-performance, native Windhawk mod bridging the gap between VLC Media Player and Discord Rich Presence.
                                Built for speed, safety, and community customization.
                            </p>
                            <div className="flex items-center gap-4">
                                <Link href="https://github.com/ciizerr" className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[#52525b] hover:text-white hover:border-white/10 transition-all">
                                    <GithubIcon size={18} />
                                </Link>
                                <Link href="https://discord.com/servers/windhawk-923944342991818753" className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[#52525b] hover:text-white hover:border-white/10 transition-all">
                                    <DiscordIcon size={18} />
                                </Link>
                            </div>
                        </div>

                        {/* Product Column */}
                        <div>
                            <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-6">Product</h4>
                            <ul className="space-y-4">
                                <li><Link href="#features" className="text-[14px] text-[#52525b] hover:text-[#FF9500] transition-colors">Features</Link></li>
                                <li><Link href="#installation" className="text-[14px] text-[#52525b] hover:text-[#FF9500] transition-colors">Installation</Link></li>
                                <li><Link href="#changelog" className="text-[14px] text-[#52525b] hover:text-[#FF9500] transition-colors">Changelog</Link></li>
                                <li><Link href="/archive" className="text-[14px] text-[#52525b] hover:text-[#FF9500] transition-colors flex items-center gap-2">Archive <ExternalLink size={12} /></Link></li>
                            </ul>
                        </div>

                        {/* Support Column */}
                        <div>
                            <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-6">Support</h4>
                            <ul className="space-y-4">
                                <li><Link href="#faq" className="text-[14px] text-[#52525b] hover:text-[#FF9500] transition-colors">Documentation</Link></li>
                                <li><Link href="https://github.com/ciizerr/vlc-discord-rpc-archive/issues" className="text-[14px] text-[#52525b] hover:text-[#FF9500] transition-colors">Report Issue</Link></li>
                                <li><Link href="#contribute" className="text-[14px] text-[#52525b] hover:text-[#FF9500] transition-colors">Submit Icon</Link></li>
                            </ul>
                        </div>

                        {/* Ecosystem Column */}
                        <div>
                            <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-6">Ecosystem</h4>
                            <ul className="space-y-4">
                                <li><Link href="https://windhawk.net" className="text-[14px] text-[#52525b] hover:text-[#FF9500] transition-colors">Windhawk</Link></li>
                                <li><Link href="https://videolan.org" className="text-[14px] text-[#52525b] hover:text-[#FF9500] transition-colors">VideoLAN</Link></li>
                            </ul>
                        </div>
                    </div>

                    {/* ── Bottom Bar ────────────────────────── */}
                    <div className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6 text-[12px] text-[#3f3f46]">
                            <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> MIT License</span>
                            <span className="flex items-center gap-1.5"><Globe size={14} /> English (US)</span>
                        </div>

                        <div className="text-[12px] text-[#3f3f46] flex items-center gap-1">
                            Made with <Heart size={12} className="text-[#FF9500] fill-[#FF9500]" /> by
                            <Link href="https://github.com/ciizerr" className="font-bold text-[#52525b] hover:text-[#FF9500] ml-1 transition-colors">ciizerr</Link>
                        </div>
                    </div>

                    {/* Final Disclaimer */}
                    <p className="mt-8 text-center text-[10px] text-[#27272a] leading-relaxed uppercase tracking-[0.1em] font-bold">
                        VLC RPC is an independent project. Not affiliated with VideoLAN, Discord, or Windhawk.
                    </p>
                </div>
            </div>
        </footer>
    );
}
