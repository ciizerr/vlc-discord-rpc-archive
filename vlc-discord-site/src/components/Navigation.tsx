"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";
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

    // Close menu on route change / resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setIsMenuOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const navLinks = [
        { label: "Features", href: "#features" },
        { label: "Install", href: "#installation" },
        { label: "Changelog", href: "#changelog" },
        { label: "FAQ", href: "#faq" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-[#09090b]/80 backdrop-blur-xl border-b border-white/[0.06]"
                    : "bg-transparent border-b border-transparent"
            }`}
        >
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Left: Logo */}
                <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                    <Image
                        src="/assets/vlc-discord-icon.png"
                        alt="VLC RPC"
                        width={28}
                        height={28}
                        className="object-contain"
                    />
                    <span className="font-semibold text-[15px] tracking-tight text-white">
                        VLC RPC
                    </span>
                </Link>

                {/* Center: Nav Links (Desktop) */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="nav-link text-[13px] font-medium text-[#a1a1aa] hover:text-white"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Right: CTA + Mobile Menu */}
                <div className="flex items-center gap-3">
                    <Link
                        href="https://windhawk.net/mods/vlc-discord-rpc"
                        className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#FF9500] hover:bg-[#e68600] text-[#09090b] text-[13px] font-semibold rounded-md transition-all duration-200 hover:shadow-[0_0_20px_rgba(255,149,0,0.3)]"
                    >
                        Get the Mod
                        <ArrowRight size={14} strokeWidth={2.5} />
                    </Link>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-[#a1a1aa] hover:text-white transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu — Slide-in Sheet */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                            onClick={() => setIsMenuOpen(false)}
                        />

                        {/* Sheet */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 bottom-0 w-72 bg-[#111113] border-l border-white/[0.06] z-50 flex flex-col"
                        >
                            {/* Sheet Header */}
                            <div className="flex items-center justify-between px-6 h-16 border-b border-white/[0.06]">
                                <span className="font-semibold text-[15px] text-white">Menu</span>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 text-[#a1a1aa] hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Sheet Links */}
                            <div className="flex flex-col px-6 py-6 gap-1">
                                {navLinks.map((link, i) => (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-[15px] font-medium text-[#a1a1aa] hover:text-white py-3 border-b border-white/[0.04] transition-colors"
                                        style={{ animationDelay: `${i * 0.05}s` }}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                <Link
                                    href="/archive"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-[15px] font-medium text-[#a1a1aa] hover:text-white py-3 border-b border-white/[0.04] transition-colors"
                                >
                                    Archive
                                </Link>
                            </div>

                            {/* Sheet CTA */}
                            <div className="mt-auto px-6 pb-8">
                                <Link
                                    href="https://windhawk.net/mods/vlc-discord-rpc"
                                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#FF9500] hover:bg-[#e68600] text-[#09090b] text-[14px] font-semibold rounded-md transition-all"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Get the Mod
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}
