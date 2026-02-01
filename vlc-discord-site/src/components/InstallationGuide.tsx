"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, Search, CheckCircle, HelpCircle, ChevronDown } from "lucide-react";
import GlassSurface from "@/components/GlassSurface";

export default function InstallationGuide() {
    const [showConfig, setShowConfig] = useState(false);
    const steps = [
        {
            icon: <Download size={24} />,
            title: "Download Windhawk",
            description: "Get the lightweight mod manager from windhawk.net."
        },
        {
            icon: <Search size={24} />,
            title: "Search Mod",
            description: "Open Windhawk and search for 'VLC Discord RPC'."
        },
        {
            icon: <CheckCircle size={24} />,
            title: "Install & Play",
            description: "Click Install. Configure VLC once, and you're done. No restart needed."
        }
    ];

    return (
        <section id="installation" className="py-24 relative overflow-hidden">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-3">
                    Installation
                    <Link href="#faq" className="text-slate-400 hover:text-orange-500 transition-colors" title="Go to FAQ">
                        <HelpCircle size={24} />
                    </Link>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                    Get up and running in less than a minute.
                </p>
            </div>

            <div className="relative max-w-4xl mx-auto px-6">
                {/* Horizontal Connecting Line (Desktop) */}
                {/* Horizontal Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-[28px] left-[15%] right-[15%] h-0.5 bg-slate-200 dark:bg-orange-500/50 dark:shadow-[0_0_15px_rgba(249,115,22,0.5)] -z-10" />

                {/* Vertical Connecting Line (Mobile) */}
                <div className="md:hidden absolute top-[28px] bottom-[28px] left-[50%] w-0.5 bg-slate-200 dark:bg-orange-500/50 dark:shadow-[0_0_15px_rgba(249,115,22,0.5)] -z-10 -translate-x-1/2" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            {/* Icon Circle */}
                            <div className="relative w-14 h-14 rounded-full bg-white dark:bg-[#161b22] border-4 border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-900 dark:text-white mb-6 shadow-sm group-hover:scale-110 transition-all duration-300 group-hover:border-orange-500/20 group-hover:text-orange-500 group-hover:shadow-[0_0_25px_rgba(249,115,22,0.3)] dark:group-hover:shadow-[0_0_25px_rgba(249,115,22,0.5)]">
                                {step.icon}
                            </div>

                            {/* Text */}
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                {step.title}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Configuration Toggle */}
                <div className="mt-8 flex flex-col items-center">
                    <button
                        onClick={() => setShowConfig(!showConfig)}
                        className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors flex items-center gap-2"
                    >
                        <span>{showConfig ? "Hide Configuration Steps" : "How to Configure VLC?"}</span>
                        <ChevronDown
                            size={16}
                            className={`transition-transform duration-300 ${showConfig ? "rotate-180" : ""}`}
                        />
                    </button>

                    <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${showConfig ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"}`}>
                        <div className="overflow-hidden">
                            <GlassSurface
                                width="100%"
                                height="auto"
                                borderRadius={20}
                                backgroundOpacity={0.05}
                                brightness={100}
                                opacity={1}
                                className="p-6 max-w-2xl mx-auto border border-white/10"
                            >
                                <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 text-left">
                                    <ol className="list-decimal list-inside space-y-4">
                                        <li>
                                            Open <strong>VLC Media Player</strong>. Go to <strong className="text-orange-500">Tools</strong> &gt; <strong>Preferences</strong> (or press <code className="bg-black/10 dark:bg-white/10 px-1 rounded">Ctrl+P</code>).
                                        </li>
                                        <li>
                                            In the bottom-left corner, under <strong>Show settings</strong>, select <strong>All</strong>.
                                        </li>
                                        <li>
                                            Navigate to <strong>Interface</strong> &gt; <strong>Main interfaces</strong>. On the right panel, check the box for <strong>Web</strong>.

                                        </li>
                                        <li>
                                            In the left sidebar, expand <strong>Main interfaces</strong> and click on <strong>Lua</strong>.
                                        </li>
                                        <li>
                                            Under <strong>Lua HTTP</strong>, set the <strong>Password</strong> to <code className="font-mono font-bold text-orange-600 dark:text-orange-400">1234</code> and <strong>Port</strong> to <code className="font-mono font-bold text-orange-600 dark:text-orange-400">8080</code>.

                                        </li>
                                        <li>
                                            Click <strong>Save</strong> and <strong className="text-red-500">Restart VLC</strong> to apply changes.
                                        </li>
                                    </ol>
                                </div>
                            </GlassSurface>
                        </div>
                    </div>
                </div>

                {/* Prominent CTA */}
                <div className="mt-16 flex justify-center">
                    <Link href="https://windhawk.net" target="_blank">
                        <GlassSurface
                            width="auto"
                            height="auto"
                            borderRadius={99}
                            backgroundOpacity={0.1}
                            brightness={110}
                            opacity={0.5}
                            className="px-6 py-3 md:px-8 md:py-4 text-slate-900 dark:text-white font-bold text-base md:text-lg hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10"
                        >
                            <div className="flex items-center gap-3">
                                <Download size={20} strokeWidth={2.5} />
                                <span>Download Windhawk</span>
                            </div>
                        </GlassSurface>
                    </Link>
                </div>
            </div>
        </section>
    );
}
