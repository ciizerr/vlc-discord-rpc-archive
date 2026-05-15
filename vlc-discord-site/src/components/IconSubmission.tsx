"use client";

import React, { useEffect, useRef } from "react";
import { Palette, ArrowRight, ImageIcon, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { GithubIcon, DiscordIcon } from "./BrandIcons";
import Link from "next/link";

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

export default function IconSubmission() {
    const sectionRef = useReveal();

    const requirements = [
        { icon: <ShieldCheck size={14} />, text: "1:1 Aspect Ratio (Square)" },
        { icon: <ImageIcon size={14} />, text: "Transparent PNG format" },
        { icon: <Zap size={14} />, text: "Clear, high-contrast design" },
        { icon: <CheckCircle2 size={14} />, text: "Set of 4: vlc, play, pause, stop" },
    ];

    return (
        <section id="contribute" className="py-24 md:py-32">
            <div ref={sectionRef} className="reveal max-w-6xl mx-auto px-6">
                <div className="relative bg-[#0d0d0f] border border-white/[0.08] rounded-[2rem] overflow-hidden shadow-2xl">
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF9500]/[0.03] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#5865F2]/[0.02] rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    <div className="flex flex-col lg:flex-row gap-0">
                        {/* Left: Design Studio / Guidelines */}
                        <div className="flex-1 p-8 md:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-white/[0.08]">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2.5 bg-[#FF9500]/10 rounded-xl text-[#FF9500]">
                                    <Palette size={22} />
                                </div>
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF9500]">
                                    Icon Studio
                                </span>
                            </div>

                            <h3 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                                Contribute your <br />
                                <span className="text-[#FF9500]">visual identity.</span>
                            </h3>

                            <p className="text-[16px] text-[#71717a] leading-relaxed mb-10 max-w-lg">
                                Help us expand the VLC Discord RPC collection. We&apos;re looking for clean, creative icon sets that fit the native aesthetic.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {requirements.map((req, i) => (
                                    <div key={i} className="flex items-center gap-3 text-[13px] text-[#a1a1aa] font-medium bg-white/[0.02] border border-white/[0.04] p-3 rounded-xl transition-all hover:bg-white/[0.05] hover:border-white/[0.1]">
                                        <div className="text-[#FF9500]">{req.icon}</div>
                                        {req.text}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: Submission Portal */}
                        <div className="lg:w-[450px] bg-[#111113]/50 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                            <div className="space-y-8">
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-2">Submit Your Design</h4>
                                    <p className="text-[14px] text-[#71717a] leading-relaxed">
                                        Choose your preferred way to share your icon pack with the maintainers.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <Link
                                        href="https://discord.com/servers/windhawk-923944342991818753"
                                        target="_blank"
                                        className="flex items-center justify-between p-4 bg-[#5865F2] hover:bg-[#4752c4] rounded-xl transition-all duration-300 group shadow-lg shadow-[#5865F2]/10"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-white/10 rounded-lg text-white">
                                                <DiscordIcon size={18} />
                                            </div>
                                            <div className="text-left">
                                                <div className="text-[14px] font-bold text-white leading-none mb-1">Community Discord</div>
                                                <div className="text-[11px] text-white/70 font-medium">Join & tag @ciizerr</div>
                                            </div>
                                        </div>
                                        <ArrowRight size={18} className="text-white/40 group-hover:text-white transition-transform group-hover:translate-x-1" />
                                    </Link>

                                    <Link
                                        href="https://github.com/ciizerr/vlc-discord-rpc-archive/issues"
                                        target="_blank"
                                        className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-[#FF9500]/30 rounded-xl transition-all duration-300 group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-white/5 rounded-lg text-[#a1a1aa] group-hover:text-white transition-colors">
                                                <GithubIcon size={18} />
                                            </div>
                                            <div className="text-left">
                                                <div className="text-[14px] font-bold text-white leading-none mb-1">GitHub Issue</div>
                                                <div className="text-[11px] text-[#71717a] font-medium">Attach files to an issue</div>
                                            </div>
                                        </div>
                                        <ArrowRight size={18} className="text-[#3f3f46] group-hover:text-white transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </div>

                                <div className="pt-4 border-t border-white/[0.05]">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF9500] to-[#5865F2] p-[1px]">
                                            <div className="w-full h-full rounded-full bg-[#111113] flex items-center justify-center text-[10px] font-bold text-white">
                                                C
                                            </div>
                                        </div>
                                        <div className="text-[11px] text-[#52525b] leading-relaxed">
                                            Contributors get credited in the <span className="text-white font-medium">Changelog</span> and <span className="text-white font-medium">Archive</span>.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
