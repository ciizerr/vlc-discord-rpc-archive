"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import GlassSurface from "@/components/GlassSurface";
import { Star, Download, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 md:px-0">
            <GlassSurface
                width="100%"
                height="auto"
                borderRadius={99}
                borderWidth={0.07}
                displace={0.5}
                distortionScale={-180}
                redOffset={0}
                backgroundOpacity={0.5}
                greenOffset={10}
                blueOffset={20}
                brightness={50}
                opacity={0.93}
                mixBlendMode="screen"
                className="px-6 py-3 relative transition-all duration-300"
            >
                <div className="flex justify-between items-center w-full text-sm font-medium text-slate-200">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-3">
                        <div className="bg-orange-500/10 p-1 rounded-full border border-orange-500/20 shadow-[0_0_15px_-3px_rgba(249,115,22,0.4)] relative">
                            <Image
                                src="/assets/vlc-discord-icon.png"
                                alt="VLC-RPC Logo"
                                width={24}
                                height={24}
                                className="object-contain"
                            />
                        </div>
                        <span className="font-bold tracking-tight text-white hidden sm:block">
                            VLC-RPC
                        </span>
                    </div>

                    {/* Center: Links (Desktop) */}
                    <div className="hidden md:flex gap-8 absolute left-1/2 -translate-x-1/2">
                        <Link
                            href="#features"
                            className="hover:text-white transition-colors"
                        >
                            Features
                        </Link>
                        <Link
                            href="/archive"
                            className="hover:text-white transition-colors"
                        >
                            Source Code
                        </Link>
                        <Link
                            href="#"
                            className="hover:text-white transition-colors opacity-60 cursor-not-allowed"
                            title="Coming Soon"
                        >
                            Themes
                        </Link>
                    </div>

                    {/* Right: Actions (Desktop) */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="https://github.com/ciizerr/vlc-discord-rpc-archive"
                            target="_blank"
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/30 hover:bg-slate-700/50 rounded-full border border-slate-700/50 hover:border-slate-500 transition-colors group backdrop-blur-sm"
                        >
                            <Star
                                size={14}
                                className="text-slate-400 group-hover:text-yellow-400 transition-colors"
                            />
                            <span className="text-xs font-bold font-mono text-slate-300">
                                1.2k
                            </span>
                        </Link>

                        <Link
                            href="https://windhawk.net/mods/vlc-discord-rpc"
                            className="flex items-center gap-2 px-5 py-2 bg-slate-100 text-slate-950 rounded-full font-bold hover:bg-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/10"
                        >
                            <span>Get Mod</span>
                            <Download size={14} strokeWidth={3} />
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-slate-300 hover:text-white transition-colors"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </GlassSurface>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 right-0 mt-4 px-2"
                    >
                        <GlassSurface
                            width="100%"
                            height="auto"
                            borderRadius={24}
                            borderWidth={0.07}
                            displace={0.5}
                            backgroundOpacity={0.5}
                            distortionScale={-180}
                            brightness={40}
                            opacity={0.95}
                            mixBlendMode="screen"
                            className="p-6 flex flex-col gap-6"
                        >
                            <div className="flex flex-col gap-4 text-center text-sm font-medium text-slate-200">
                                <Link href="#features" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-white transition-colors border-b border-white/5">Features</Link>
                                <Link href="/archive" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-white transition-colors border-b border-white/5">Source Code</Link>
                                <Link href="#" className="py-2 hover:text-white transition-colors opacity-60">Themes (Soon)</Link>
                            </div>

                            <div className="flex flex-col gap-3 mt-2">
                                <Link
                                    href="https://windhawk.net/mods/vlc-discord-rpc"
                                    className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 text-slate-950 rounded-xl font-bold hover:bg-white transition-all active:scale-95 shadow-lg shadow-white/10"
                                >
                                    <span>Get Mod</span>
                                    <Download size={14} strokeWidth={3} />
                                </Link>
                                <Link
                                    href="https://github.com/ciizerr/vlc-discord-rpc-archive"
                                    target="_blank"
                                    className="flex items-center justify-center gap-2 px-3 py-3 bg-slate-800/30 hover:bg-slate-700/50 rounded-xl border border-slate-700/50 hover:border-slate-500 transition-colors group"
                                >
                                    <Star
                                        size={14}
                                        className="text-slate-400 group-hover:text-yellow-400 transition-colors"
                                    />
                                    <span className="text-sm font-bold font-mono text-slate-300">
                                        Star on GitHub
                                    </span>
                                </Link>
                            </div>
                        </GlassSurface>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
