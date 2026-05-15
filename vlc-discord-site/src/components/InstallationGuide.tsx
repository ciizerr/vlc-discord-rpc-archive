"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Download, Search, CheckCircle, ChevronDown, ArrowRight } from "lucide-react";

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

function StepItem({ step, index }: { step: Step; index: number }) {
    const stepRef = useReveal();
    return (
        <div
            ref={stepRef}
            className="reveal flex gap-6 items-start"
            style={{ transitionDelay: `${index * 0.15}s` }}
        >
            {/* Timeline Dot */}
            <div className="timeline-dot">
                {step.icon}
            </div>

            {/* Content Card */}
            <div className="flex-1 bg-[#111113] border border-white/[0.06] rounded-xl p-6 card-hover">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-[11px] font-mono font-bold text-[#FF9500] tracking-wider">
                        STEP {step.number}
                    </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 tracking-tight">
                    {step.title}
                </h3>
                <p className="text-[14px] text-[#a1a1aa] leading-relaxed">
                    {step.description}
                </p>
            </div>
        </div>
    );
}

export default function InstallationGuide() {
    const [showConfig, setShowConfig] = useState(false);
    const headerRef = useReveal();

    const steps = [
        {
            icon: <Download size={18} />,
            number: "01",
            title: "Download Windhawk",
            description: "Get the lightweight mod manager from windhawk.net. It's free, open-source, and takes under a minute to install.",
        },
        {
            icon: <Search size={18} />,
            number: "02",
            title: "Find the Mod",
            description: "Open Windhawk, go to the mod browser, and search for 'VLC Discord RPC'. Click Install.",
        },
        {
            icon: <CheckCircle size={18} />,
            number: "03",
            title: "Configure & Play",
            description: "Set up VLC's web interface once (password: 1234, port: 8080), restart VLC, and you're live on Discord.",
        },
    ];

    return (
        <section id="installation" className="py-24 md:py-32">
            {/* Section Header */}
            <div ref={headerRef} className="reveal mb-16">
                <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#FF9500] mb-3">
                    Get Started
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
                    Up and running in 60 seconds
                </h2>
                <p className="text-[14px] text-[#71717a] max-w-md">
                    Three steps. No terminal commands. No configuration files.
                </p>
            </div>

            {/* Timeline */}
            <div className="relative max-w-2xl">
                {/* Vertical line */}
                <div className="timeline-line" />

                <div className="flex flex-col gap-12">
                    {steps.map((step, index) => (
                        <StepItem key={index} step={step} index={index} />
                    ))}
                </div>
            </div>

            {/* VLC Configuration Toggle */}
            <div className="mt-12 max-w-2xl pl-[64px]">
                <button
                    onClick={() => setShowConfig(!showConfig)}
                    className="flex items-center gap-2 text-[13px] font-medium text-[#a1a1aa] hover:text-[#FF9500] transition-colors group"
                >
                    <span>{showConfig ? "Hide configuration details" : "How to configure VLC's web interface?"}</span>
                    <ChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${showConfig ? "rotate-180" : ""}`}
                    />
                </button>

                <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        showConfig ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                    <div className="overflow-hidden">
                        <div className="bg-[#111113] border border-white/[0.06] rounded-xl p-6">
                            <div className="space-y-4 text-[13px] text-[#a1a1aa]">
                                <ol className="list-decimal list-inside space-y-3 leading-relaxed">
                                    <li>
                                        Open <strong className="text-white">VLC Media Player</strong>. Go to <strong className="text-[#FF9500]">Tools</strong> &gt; <strong className="text-white">Preferences</strong> (or press <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-[12px] font-mono">Ctrl+P</code>).
                                    </li>
                                    <li>
                                        In the bottom-left corner, under <strong className="text-white">Show settings</strong>, select <strong className="text-white">All</strong>.
                                    </li>
                                    <li>
                                        Navigate to <strong className="text-white">Interface</strong> &gt; <strong className="text-white">Main interfaces</strong>. Check the box for <strong className="text-white">Web</strong>.
                                    </li>
                                    <li>
                                        Expand <strong className="text-white">Main interfaces</strong> and click <strong className="text-white">Lua</strong>.
                                    </li>
                                    <li>
                                        Under <strong className="text-white">Lua HTTP</strong>, set Password to <code className="font-mono font-bold text-[#FF9500]">1234</code> and Port to <code className="font-mono font-bold text-[#FF9500]">8080</code>.
                                    </li>
                                    <li>
                                        Click <strong className="text-white">Save</strong> and <strong className="text-red-400">restart VLC</strong>.
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="mt-12 max-w-2xl pl-[64px]">
                <Link
                    href="https://windhawk.net"
                    target="_blank"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#111113] border border-white/[0.06] text-white text-[14px] font-semibold rounded-lg hover:border-[#FF9500]/30 hover:shadow-[0_0_20px_rgba(255,149,0,0.1)] transition-all duration-200"
                >
                    Download Windhawk
                    <ArrowRight size={16} />
                </Link>
            </div>
        </section>
    );
}
