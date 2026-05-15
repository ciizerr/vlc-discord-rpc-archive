"use client";

import React, { useEffect, useRef } from "react";
import { RefreshCw, Tv, Search, Cpu, Lock, Layout } from "lucide-react";

interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
    label: string;
    span?: string;
    gradient?: string;
}

const bentoFeatures: Feature[] = [
    {
        icon: <Cpu size={32} strokeWidth={1.5} />,
        title: "Native Architecture",
        description: "Built as a pure C++ Windhawk mod. By injecting directly into the VLC process, we eliminate the need for background Node.js scripts or separate applications. Zero system tray clutter, zero overhead.",
        label: "Performance",
        span: "md:col-span-2 md:row-span-2",
        gradient: "from-[#FF9500]/10 via-transparent to-transparent",
    },
    {
        icon: <Layout size={24} strokeWidth={2} />,
        title: "Title Alchemy",
        description: "Automatically strips scene tags (WEB-DL, x265) and piracy URLs. Your status stays clean and professional.",
        label: "Aesthetics",
        span: "md:col-span-1 md:row-span-1",
    },
    {
        icon: <Lock size={24} strokeWidth={2} />,
        title: "Privacy First",
        description: "100% local. Your playback data and file paths never leave your machine.",
        label: "Privacy",
        span: "md:col-span-1 md:row-span-1",
    },
    {
        icon: <Tv size={24} strokeWidth={2} />,
        title: "Deep Metadata",
        description: "TV shows show Season/Episode. Music shows Artist/Album. Includes active audio language and quality badges.",
        label: "Information",
        span: "md:col-span-1 md:row-span-1",
    },
    {
        icon: <RefreshCw size={24} strokeWidth={2} />,
        title: "Smart Cover Art",
        description: "Automatic local art uploads with Bing fallback for posters.",
        label: "Visuals",
        span: "md:col-span-1 md:row-span-1",
    },
    {
        icon: <Search size={24} strokeWidth={2} />,
        title: "Interactive Search",
        description: "Configurable search button for Google, IMDb, or YouTube.",
        label: "Interaction",
        span: "md:col-span-1 md:row-span-1",
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
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return ref;
}

function BentoCard({ feature, index }: { feature: Feature; index: number }) {
    const ref = useReveal();
    const isLarge = feature.span?.includes("row-span-2");

    return (
        <article
            ref={ref}
            className={`reveal group relative bg-[#0d0d0f] border border-white/[0.05] rounded-2xl p-8 overflow-hidden transition-all duration-500 hover:border-[#FF9500]/20 hover:shadow-[0_0_40px_rgba(255,149,0,0.03)] ${feature.span}`}
            style={{ transitionDelay: `${index * 0.1}s` }}
            itemScope
            itemType="https://schema.org/Feature"
            role="listitem"
        >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient || "from-white/[0.01] to-transparent"} opacity-50`} />

            {/* Animated Glow on Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_var(--x)_var(--y),rgba(255,149,0,0.05)_0%,transparent_70%)] pointer-events-none"
                style={{
                    '--x': '50%',
                    '--y': '50%'
                } as React.CSSProperties}
            />

            <div className="relative z-10 h-full flex flex-col">
                <div className="mb-6">
                    <div
                        className={`flex items-center justify-center rounded-xl bg-white/[0.03] text-[#FF9500] border border-white/[0.05] shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${isLarge ? 'w-14 h-14' : 'w-11 h-11'}`}
                        aria-hidden="true"
                    >
                        {feature.icon}
                    </div>
                </div>

                <div>
                    <span
                        className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-[#3f3f46] mb-2 group-hover:text-[#FF9500] transition-colors"
                        itemProp="category"
                    >
                        {feature.label}
                    </span>
                    <h3
                        className={`${isLarge ? 'text-2xl md:text-3xl' : 'text-lg'} font-bold text-white mb-3 tracking-tight`}
                        itemProp="name"
                    >
                        {feature.title}
                    </h3>
                    <p
                        className={`${isLarge ? 'text-[15px] md:text-[16px]' : 'text-[13px]'} leading-relaxed text-[#71717a] group-hover:text-[#a1a1aa] transition-colors`}
                        itemProp="description"
                    >
                        {feature.description}
                    </p>
                </div>

                {isLarge && (
                    <div className="mt-auto pt-10" aria-hidden="true">
                        {/* Optional visual element for the large card */}
                        <div className="w-full h-px bg-gradient-to-right from-[#FF9500]/20 to-transparent mb-6" />
                        <div className="flex gap-4">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#FF9500]" />
                            <div className="h-1.5 w-8 rounded-full bg-[#FF9500]/20" />
                            <div className="h-1.5 w-4 rounded-full bg-[#FF9500]/10" />
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}

export default function FeatureSection() {
    const headerRef = useReveal();

    return (
        <section id="features" className="py-24 md:py-32" aria-labelledby="features-title">
            {/* Section Header */}
            <header ref={headerRef} className="reveal mb-16 text-center md:text-left">
                <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF9500] mb-4">
                    Features
                </span>
                <h2 id="features-title" className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6 max-w-2xl">
                    Built for <span className="text-[#FF9500]">Performance</span>
                </h2>
                <p className="text-[15px] text-[#71717a] max-w-xl leading-relaxed">
                    Unlike other RPC solutions that require separate background apps, our native Windhawk mod lives directly inside VLC. It only runs when VLC runs, consumes zero resources when you&apos;re not watching, and requires no manual startup. It just works.
                </p>
            </header>

            <div
                className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 h-auto grid-flow-dense"
                role="list"
                aria-label="VLC Discord RPC features"
            >
                {bentoFeatures.map((feature, i) => (
                    <BentoCard key={feature.title} feature={feature} index={i} />
                ))}
            </div>
        </section>
    );
}
