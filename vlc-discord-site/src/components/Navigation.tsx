"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight, ExternalLink, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { label: "Features", href: "#features" },
        { label: "Try it", href: "#try-it" },
        { label: "Install", href: "#installation" },
        { label: "Changelog", href: "#changelog" },
        { label: "FAQ", href: "#faq" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 pointer-events-none">
            <nav
                className={`max-w-5xl mx-auto flex items-center justify-between transition-all duration-500 ease-out pointer-events-auto
                    ${scrolled 
                        ? "bg-[#09090b]/70 backdrop-blur-xl border border-white/[0.08] px-4 md:px-6 py-2.5 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]" 
                        : "bg-transparent border border-transparent px-0 py-2 rounded-none"
                    }`}
            >
                {/* Left: Logo */}
                <Link href="/" className="flex items-center gap-3 shrink-0 group">
                    <div className="relative">
                        <motion.div 
                            whileHover={{ rotate: 15, scale: 1.1 }}
                            className="relative z-10"
                        >
                            <Image
                                src="/assets/vlc-discord-icon.png"
                                alt="VLC RPC"
                                width={32}
                                height={32}
                                className="object-contain filter drop-shadow-[0_4px_10px_rgba(255,149,0,0.3)]"
                            />
                        </motion.div>
                        <div className="absolute inset-0 bg-[#FF9500]/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="font-bold text-[16px] tracking-tight text-white group-hover:text-[#FF9500] transition-colors">
                        VLC RPC
                    </span>
                </Link>

                {/* Center: Navigation Links (Desktop) */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="relative px-4 py-2 text-[13px] font-semibold text-[#a1a1aa] hover:text-white transition-all duration-300 group/link"
                        >
                            {link.label}
                            <span className="absolute bottom-1 left-4 right-4 h-[2px] bg-[#FF9500] scale-x-0 group-hover/link:scale-x-100 transition-transform origin-center" />
                        </Link>
                    ))}
                    <Link
                        href="/archive"
                        className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-[#52525b] hover:text-[#a1a1aa] transition-colors group/archive"
                    >
                        Archive
                        <ExternalLink size={12} className="opacity-40 group-hover/archive:opacity-100" />
                    </Link>
                </div>

                {/* Right: CTA */}
                <div className="flex items-center gap-3">
                    <AnimatePresence>
                        {scrolled && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={() => window.dispatchEvent(new Event("open-search"))}
                                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] text-white transition-all group cursor-pointer"
                                aria-label="Open Search (Ctrl+K)"
                                title="Search (Ctrl+K or /)"
                            >
                                <Search size={14} className="text-[#FF9500] shrink-0" />
                                <span className="text-[13px] font-semibold text-[#a1a1aa] group-hover:text-white hidden lg:inline">Search</span>
                                <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/40 text-[10px] font-mono text-[#71717a] group-hover:text-[#a1a1aa] transition-colors ml-1">
                                    Ctrl K
                                </kbd>
                            </motion.button>
                        )}
                    </AnimatePresence>
                    <Link
                        href="https://windhawk.net/mods/vlc-discord-rpc"
                        className={`hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[13px] transition-all duration-300
                            ${scrolled 
                                ? "bg-[#FF9500] text-[#09090b] hover:shadow-[0_0_20px_rgba(255,149,0,0.4)]" 
                                : "bg-white/[0.05] border border-white/[0.1] text-white hover:bg-[#FF9500] hover:text-[#09090b] hover:border-transparent"
                            }`}
                    >
                        Get Mod
                        <ArrowRight size={14} strokeWidth={2.5} />
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`md:hidden p-2.5 rounded-xl transition-all duration-300 
                            ${scrolled ? "bg-white/[0.05] text-white" : "text-[#a1a1aa] hover:text-white"}`}
                    >
                        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Navigation Sheet */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] pointer-events-auto"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[300px] bg-[#0d0d0f] border-l border-white/[0.08] z-[120] pointer-events-auto flex flex-col p-8"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <span className="font-bold text-white text-lg tracking-tight">Navigation</span>
                                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-[#52525b] hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Mobile Search Button */}
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    window.dispatchEvent(new Event("open-search"));
                                }}
                                className="flex items-center gap-3 w-full p-3.5 mb-6 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white font-semibold text-sm transition-all active:scale-95"
                            >
                                <Search size={18} className="text-[#FF9500]" />
                                Search Movies & Shows
                            </button>

                            <div className="flex flex-col gap-2">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.label}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="block text-2xl font-bold text-[#a1a1aa] hover:text-[#FF9500] py-4 transition-colors border-b border-white/[0.03]"
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: navLinks.length * 0.1 }}
                                >
                                    <Link
                                        href="/archive"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block text-2xl font-bold text-[#52525b] hover:text-[#a1a1aa] py-4 transition-colors border-b border-white/[0.03]"
                                    >
                                        Archive
                                    </Link>
                                </motion.div>
                            </div>

                            <div className="mt-auto">
                                <Link
                                    href="https://windhawk.net/mods/vlc-discord-rpc"
                                    className="flex items-center justify-center gap-3 w-full py-4 bg-[#FF9500] text-[#09090b] font-bold rounded-2xl shadow-xl shadow-[#FF9500]/10"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Install via Windhawk
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
