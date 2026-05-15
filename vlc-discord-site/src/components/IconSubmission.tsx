"use client";

import React, { useEffect, useRef } from "react";
import { Palette, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function IconSubmission() {
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

    return (
        <section className="py-12">
            <div
                ref={ref}
                className="reveal relative bg-[#111113] border border-white/[0.06] rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 card-hover overflow-hidden"
            >
                {/* Subtle accent glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF9500]/[0.04] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#FF9500]/10 text-[#FF9500]">
                            <Palette size={20} />
                        </div>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#FF9500]">
                            Community
                        </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2">
                        Got an Icon Idea?
                    </h3>
                    <p className="text-[14px] text-[#a1a1aa] max-w-md">
                        We&apos;re accepting icon submissions for upcoming themes. Help expand the collection with your creative designs.
                    </p>
                </div>

                <div className="relative z-10 shrink-0">
                    <Link
                        href="https://github.com/ciizerr/vlc-discord-rpc-archive/issues"
                        target="_blank"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.05] border border-white/[0.08] text-white text-[14px] font-semibold rounded-lg hover:bg-white/[0.08] hover:border-white/[0.12] transition-all duration-200"
                    >
                        Submit Icon
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
