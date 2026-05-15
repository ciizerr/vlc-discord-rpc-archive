"use client";

import React, { useEffect, useRef } from "react";
import { Zap, Shield, RefreshCw, Tv, Search, FileText } from "lucide-react";

interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
    label: string;
}

const primaryFeatures: Feature[] = [
    {
        icon: <Zap size={24} />,
        title: "Zero Bloat",
        description: "Injects directly into the VLC process via Windhawk. No background Node.js scripts eating your RAM. No separate apps running. Just native code, running where it should.",
        label: "Performance",
    },
    {
        icon: <Shield size={24} />,
        title: "Local Logic",
        description: "Runs 100% locally. Your playback data never leaves your machine. No external APIs, no telemetry, no cloud. Everything stays on your PC.",
        label: "Privacy",
    },
    {
        icon: <RefreshCw size={24} />,
        title: "Auto-State Detection",
        description: "Automatically switches between Playing, Paused, and Stopped states using VLC's internal events. Instant response, zero polling overhead.",
        label: "Automation",
    },
];

const secondaryFeatures: Feature[] = [
    {
        icon: <Tv size={20} />,
        title: "Smart Recognition",
        description: "Auto-detects SxxExx format for TV shows with season and episode info.",
        label: "Intelligence",
    },
    {
        icon: <Search size={20} />,
        title: "Instant Search",
        description: "Configurable 'Search This' button — redirect to Google, IMDb, or YouTube.",
        label: "Interactive",
    },
    {
        icon: <FileText size={20} />,
        title: "Rich Details",
        description: "Displays resolution (4K/HDR), audio language, and advanced metadata.",
        label: "Metadata",
    },
];

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

function PrimaryFeatureCard({ feature, index }: { feature: Feature; index: number }) {
    const ref = useReveal();

    return (
        <div
            ref={ref}
            className="reveal group relative bg-[#111113] border border-white/[0.06] rounded-xl p-8 card-hover"
            style={{ transitionDelay: `${index * 0.1}s` }}
        >
            {/* Subtle glow on hover */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[#FF9500]/[0.03] to-transparent" />

            <div className="relative z-10">
                {/* Label */}
                <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#FF9500] mb-4">
                    {feature.label}
                </span>

                {/* Icon + Title row */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#FF9500]/10 text-[#FF9500]">
                        {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                        {feature.title}
                    </h3>
                </div>

                {/* Description */}
                <p className="text-[14px] leading-relaxed text-[#a1a1aa] max-w-md">
                    {feature.description}
                </p>
            </div>
        </div>
    );
}

function SecondaryFeatureCard({ feature, index }: { feature: Feature; index: number }) {
    const ref = useReveal();

    return (
        <div
            ref={ref}
            className="reveal group relative bg-[#111113]/50 border border-white/[0.04] rounded-lg p-6 card-hover"
            style={{ transitionDelay: `${0.3 + index * 0.1}s` }}
        >
            <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-md bg-white/[0.04] text-[#a1a1aa] group-hover:text-[#FF9500] transition-colors shrink-0 mt-0.5">
                    {feature.icon}
                </div>
                <div>
                    <h4 className="text-[14px] font-semibold text-white mb-1">
                        {feature.title}
                    </h4>
                    <p className="text-[13px] leading-relaxed text-[#71717a]">
                        {feature.description}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function FeatureSection() {
    const headerRef = useReveal();

    return (
        <section id="features" className="py-24 md:py-32">
            {/* Section Header */}
            <div ref={headerRef} className="reveal mb-16">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#FF9500] mb-3">
                            Why VLC RPC
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                            Engineered, not hacked together
                        </h2>
                    </div>
                    <p className="text-[14px] text-[#71717a] max-w-sm md:text-right">
                        Built as a native Windhawk mod — no external processes, no wasted resources, no compromises.
                    </p>
                </div>
            </div>

            {/* Primary Features — Large Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {primaryFeatures.map((feature, i) => (
                    <PrimaryFeatureCard key={feature.title} feature={feature} index={i} />
                ))}
            </div>

            {/* Divider */}
            <div className="section-divider my-8" />

            {/* Secondary Features — Compact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {secondaryFeatures.map((feature, i) => (
                    <SecondaryFeatureCard key={feature.title} feature={feature} index={i} />
                ))}
            </div>
        </section>
    );
}
