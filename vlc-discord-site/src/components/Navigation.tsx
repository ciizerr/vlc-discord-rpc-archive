"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import GlassSurface from "@/components/GlassSurface";
import { Star, Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";


export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();

    // Prevent hydration mismatch
    const [mounted, setMounted] = useState(false);
    React.useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    // --- NAVBAR CONFIGURATION ---
    const NAV_DARK = {
        backgroundOpacity: 0.5,
        brightness: 100, // 100% = Normal brightness
        opacity: 0.93,
        mixBlendMode: "screen" as const, // 'screen' | 'overlay' | 'multiply' | 'normal'
    };

    const NAV_LIGHT = {
        backgroundOpacity: 0.6, // Slightly more opaque
        brightness: 100,        // Normal brightness
        opacity: 0.95,
        mixBlendMode: "normal" as const, // Normal blending for visibility
    };

    const navSettings = theme === 'dark' ? NAV_DARK : NAV_LIGHT;
    // ----------------------------

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 md:px-0">
            <GlassSurface
                width="100%"
                height="auto"
                borderRadius={50}
                borderWidth={0.07}
                blur={11}

                // Dynamic Settings
                backgroundOpacity={navSettings.backgroundOpacity}
                brightness={navSettings.brightness}
                opacity={navSettings.opacity}
                mixBlendMode={navSettings.mixBlendMode}

                className="px-6 py-3 relative transition-all duration-300"
            >
                <div className="flex justify-between items-center w-full text-sm font-medium text-foreground">
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
                        <span className="font-bold tracking-tight text-foreground hidden sm:block">
                            Rich Presence
                        </span>
                    </div>

                    {/* Center: Links (Desktop) */}
                    <div className="hidden md:flex gap-8 absolute left-1/2 -translate-x-1/2">
                        <Link
                            href="#features"
                            className="hover:text-primary transition-colors text-foreground/80"
                        >
                            Features
                        </Link>
                        <Link
                            href="/archive"
                            className="hover:text-primary transition-colors text-foreground/80"
                        >
                            Source Code
                        </Link>
                    </div>

                    {/* Right: Actions (Desktop) */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-foreground/70 hover:text-orange-400 hover:scale-110 active:scale-95 transition-all"
                            title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        <Link
                            href="https://github.com/ciizerr/vlc-discord-rpc-archive"
                            target="_blank"
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/5 hover:bg-slate-700/10 rounded-full border border-slate-700/20 hover:border-slate-500/40 transition-colors group backdrop-blur-sm"
                        >
                            <Star
                                size={14}
                                className="text-slate-400 group-hover:text-yellow-400 transition-colors"
                            />
                            <span className="text-xs font-bold font-mono text-foreground/70">
                                1.2k
                            </span>
                        </Link>


                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-foreground/70 hover:text-orange-400 transition-all"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 text-foreground/70 hover:text-foreground transition-colors"
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
                            borderRadius={50}
                            borderWidth={0.07}
                            blur={11}

                            // Dynamic Settings
                            backgroundOpacity={navSettings.backgroundOpacity}
                            brightness={navSettings.brightness}
                            opacity={navSettings.opacity}
                            mixBlendMode={navSettings.mixBlendMode}
                            className="p-6 flex flex-col gap-6"
                        >
                            <div className="flex flex-col gap-4 text-center text-sm font-medium text-foreground">
                                <Link href="#features" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-primary transition-colors border-b border-white/5">Features</Link>
                                <Link href="/archive" onClick={() => setIsMenuOpen(false)} className="py-2 hover:text-primary transition-colors border-b border-white/5">Source Code</Link>
                            </div>

                            <div className="flex flex-col gap-3 mt-2">

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
