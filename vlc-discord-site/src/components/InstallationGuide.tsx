"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Download, Search, CheckCircle, Settings2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

function useReveal() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add("visible");
                    observer.unobserve(el);
                }
            },
            { threshold: 0.15 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return ref;
}

interface Step {
    icon: React.ReactNode;
    number: string;
    title: string;
    description: string;
}

const steps: Step[] = [
    {
        icon: <Download size={20} />,
        number: "01",
        title: "Download Windhawk",
        description: "Get the lightweight mod manager from windhawk.net. It's the engine that powers our native VLC integration.",
    },
    {
        icon: <Search size={20} />,
        number: "02",
        title: "Find the Mod",
        description: "Open Windhawk, Go to Explore tab, and search for 'VLC Discord RPC'. One click to install.",
    },
    {
        icon: <CheckCircle size={20} />,
        number: "03",
        title: "Ready for Playback",
        description: "Once installed, the mod is active. Configure VLC to start sharing your status.",
    },
];

export default function InstallationGuide() {
    const headerRef = useReveal();
    const contentRef = useReveal();

    return (
        <section id="installation" className="py-24 md:py-32" aria-labelledby="installation-title">
            <div className="max-w-6xl mx-auto px-6">
                {/* Section Header */}
                <div ref={headerRef} className="reveal mb-16 max-w-2xl">
                    <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF9500] mb-4">
                        Get Started
                    </span>
                    <h2 id="installation-title" className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
                        Up and running in <span className="text-[#FF9500]">seconds</span>.
                    </h2>
                    <p className="text-[16px] text-[#71717a] leading-relaxed">
                        Native, lightweight, and engineered to work without background overhead. Follow these simple steps to transform your Discord presence.
                    </p>
                </div>

                {/* Two-Column Layout */}
                <div ref={contentRef} className="reveal flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

                    {/* Left Side: Steps with Timeline Connector */}
                    <div className="flex-1 w-full relative">
                        {/* Vertical Timeline Connector Line */}
                        <div className="absolute left-[20px] top-10 bottom-10 w-[2px] bg-gradient-to-b from-[#FF9500] via-[#FF9500]/20 to-transparent z-0 hidden md:block" />

                        <div className="space-y-8 relative z-10">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.01, x: 5 }}
                                    className="group relative bg-[#0d0d0f]/50 backdrop-blur-sm border border-white/[0.05] rounded-xl p-6 transition-all duration-300 hover:border-[#FF9500]/30 hover:bg-[#111113] cursor-default"
                                >
                                    {/* Active Accent Bar */}
                                    <div className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-[#FF9500] opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="flex gap-6 items-start">
                                        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-[#09090b] text-[#FF9500] border border-white/[0.1] shadow-xl group-hover:bg-[#FF9500]/10 group-hover:border-[#FF9500]/20 transition-all duration-300 relative z-20">
                                            {step.icon}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="text-[10px] font-bold text-[#FF9500]/50 tracking-[0.1em] uppercase group-hover:text-[#FF9500] transition-colors">
                                                    Step {step.number}
                                                </span>
                                            </div>
                                            <h3 className="text-[17px] font-bold text-white mb-2 transition-colors group-hover:text-[#FF9500]/90">
                                                {step.title}
                                            </h3>
                                            <p className="text-[14px] text-[#71717a] leading-relaxed group-hover:text-[#a1a1aa] transition-colors">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="pt-8 pl-1">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                    href="https://windhawk.net"
                                    target="_blank"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.03] border border-white/[0.08] text-white text-[14px] font-semibold rounded-lg hover:bg-white/[0.06] hover:border-[#FF9500]/30 transition-all duration-200 group"
                                >
                                    Download Windhawk
                                    <ExternalLink size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            </motion.div>
                        </div>
                    </div>

                    {/* Right Side: VLC Configuration (The Sideways Panel) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="w-full lg:w-[420px] shrink-0"
                    >
                        <div className="sticky top-24 bg-[#111113] border border-white/[0.06] rounded-2xl p-8 shadow-2xl transition-all duration-500 hover:border-[#FF9500]/20 group/panel">
                            {/* Inner Panel Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FF9500]/[0.02] to-transparent opacity-0 group-hover/panel:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            <div className="relative z-10 flex items-center gap-3 mb-6">
                                <motion.div
                                    whileHover={{ rotate: 180 }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                    className="flex items-center justify-center w-8 h-8 rounded-md bg-[#FF9500]/10 text-[#FF9500]"
                                >
                                    <Settings2 size={18} />
                                </motion.div>
                                <h3 className="text-lg font-bold text-white tracking-tight">
                                    VLC Configuration
                                </h3>
                            </div>

                            <p className="relative z-10 text-[13px] text-[#71717a] mb-8 leading-relaxed">
                                To allow the mod to communicate with VLC, you need to enable the web interface. <strong>This is a one-time setup.</strong>
                            </p>

                            <div className="relative z-10 space-y-6">
                                <div className="relative pl-6 border-l border-white/[0.06] space-y-6">
                                    {[
                                        { title: "Enable Web Interface", text: "Go to Tools > Preferences > All > Interface > Main interfaces. Check Web." },
                                        { title: "Set Password", text: "Under Lua HTTP, set any password. The mod will auto-detect it, but use 1234 if it doesn't work.", highlight: "1234" },
                                        { title: "Restart VLC", text: "Save your settings and restart VLC for changes to take effect." }
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ x: 5 }}
                                            className="relative group/item"
                                        >
                                            <div className="absolute -left-[25px] top-1 w-2 h-2 rounded-full bg-white/[0.2] group-hover/item:bg-[#FF9500] transition-colors" />
                                            <p className="text-[13px] text-white font-medium mb-1 transition-colors group-hover/item:text-[#FF9500]/90">{item.title}</p>
                                            <p className="text-[12px] text-[#71717a] leading-relaxed">
                                                {item.text.split(item.highlight || "").map((part, index, array) => (
                                                    <React.Fragment key={index}>
                                                        {part}
                                                        {index < array.length - 1 && <code className="text-[#FF9500] font-mono font-bold">{item.highlight}</code>}
                                                    </React.Fragment>
                                                ))}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative z-10 mt-10 p-4 bg-white/[0.02] border border-white/[0.04] rounded-lg group-hover/panel:bg-[#FF9500]/[0.03] group-hover/panel:border-[#FF9500]/10 transition-all duration-300"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 text-[#FF9500]">
                                        <CheckCircle size={14} />
                                    </div>
                                    <p className="text-[11px] text-[#a1a1aa] leading-relaxed uppercase tracking-wider font-semibold group-hover/panel:text-white/80 transition-colors">
                                        VLC is now ready to share your media status with Discord.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
