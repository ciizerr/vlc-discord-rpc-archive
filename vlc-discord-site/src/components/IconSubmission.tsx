"use client";

import React from "react";
import { Palette, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function IconSubmission() {
    return (
        <section className="py-12 max-w-4xl mx-auto px-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 to-purple-600/10 backdrop-blur-md border border-slate-200 dark:border-white/10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 group shadow-lg">

                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-500/30 transition-all duration-500" />

                <div className="relative z-10 flex-1 text-center md:text-left">
                    <div className="inline-flex items-center justify-center p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 mb-4">
                        <Palette size={24} />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        Got an Icon Idea?
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                        We are accepting icon submissions for upcoming themes! Help us expand the collection with your creative designs.
                    </p>
                </div>

                <div className="relative z-10">
                    <Link
                        href="https://github.com/ciizerr/vlc-discord-rpc-archive/issues"
                        target="_blank"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold hover:scale-105 active:scale-95 transition-all"
                    >
                        Submit Icon
                        <ArrowRight size={18} />
                    </Link>
                </div>

            </div>
        </section>
    );
}
