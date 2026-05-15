"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Film, Music as MusicIcon, MousePointer2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GithubIcon } from "./BrandIcons";
import DiscordCard from "./DiscordCard";

export default function HeroSection() {
    const [mode, setMode] = useState<'video' | 'music'>('video');

    return (
        <section className="relative w-full pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* --- Ambient Background --- */}
            <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-[#FF9500]/[0.06] rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-5%] right-[-5%] w-[35%] h-[35%] bg-[#5865F2]/[0.04] rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* --- Left: User-Friendly Message --- */}
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF9500]/10 border border-[#FF9500]/20 text-[#FF9500] text-[12px] font-bold tracking-wide mb-8"
                        >
                            <Zap size={14} />
                            Simple 1-Minute Setup
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] mb-8"
                        >
                            Share your <br />
                            <span className="text-[#FF9500]">VLC status</span> on <span className="text-[#5865F2]">Discord.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="text-[18px] md:text-[20px] text-[#a1a1aa] leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0"
                        >
                            Automatically show your movies and music as your Discord status. It&apos;s fast, lightweight, and works perfectly in the background.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                        >
                            <Link
                                href="https://windhawk.net/mods/vlc-discord-rpc"
                                className="group inline-flex items-center gap-2 px-8 py-4 bg-[#FF9500] text-[#09090b] text-[15px] font-bold rounded-2xl transition-all hover:shadow-[0_10px_30px_rgba(255,149,0,0.3)] hover:scale-[1.02]"
                            >
                                Start Sharing Now
                                <ArrowRight size={18} />
                            </Link>

                            <Link
                                href="https://github.com/ciizerr/vlc-discord-rpc-archive"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white/[0.03] border border-white/[0.08] text-white text-[15px] font-bold rounded-2xl transition-all hover:bg-white/[0.06]"
                            >
                                <GithubIcon size={18} />
                                Star on GitHub
                            </Link>
                        </motion.div>

                        {/* Truth-Based Markers */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="mt-12 flex flex-wrap justify-center lg:justify-start items-center gap-8 text-[13px] font-bold text-[#52525b]"
                        >
                            <div className="flex items-center gap-2"><MousePointer2 size={16} className="text-[#FF9500]/60" /> Easy to Use</div>
                            <div className="flex items-center gap-2"><Clock size={16} className="text-[#FF9500]/60" /> One time setup</div>
                            <div className="flex items-center gap-2"><ShieldCheck size={16} className="text-[#FF9500]/60" /> Zero Ram Usage</div>
                        </motion.div>
                    </div>

                    {/* --- Right: Real Preview --- */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative w-full max-w-[480px] lg:max-w-none lg:flex-1 flex flex-col items-center lg:items-end"
                    >
                        {/* Interactive Switcher */}
                        <div className="mb-8 p-1 bg-[#111113] border border-white/[0.08] rounded-2xl flex items-center gap-1 shadow-2xl">
                            <button
                                onClick={() => setMode('video')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all ${mode === 'video' ? 'bg-[#FF9500] text-[#09090b]' : 'text-[#52525b] hover:text-white'}`}
                            >
                                <Film size={14} />Video
                            </button>
                            <button
                                onClick={() => setMode('music')}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all ${mode === 'music' ? 'bg-[#FF9500] text-[#09090b]' : 'text-[#52525b] hover:text-white'}`}
                            >
                                <MusicIcon size={14} />Music
                            </button>
                        </div>

                        <div className="relative group">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={mode}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative z-20 scale-110 md:scale-125 transform-gpu origin-center lg:origin-right"
                                >
                                    <DiscordCard mode={mode} />
                                </motion.div>
                            </AnimatePresence>

                            {/* Ambient card glow */}
                            <div className="absolute inset-0 bg-[#FF9500]/5 blur-[60px] -z-10 rounded-full" />
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
