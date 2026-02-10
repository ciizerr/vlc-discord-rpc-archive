"use client";

import { useState } from "react";
import DiscordCard from "./DiscordCard";
import { Monitor, Music } from "lucide-react";

type Mode = 'video' | 'music';

export default function DiscordCardWrapper() {
    const [mode, setMode] = useState<Mode>('video');

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="relative group inline-block transition-all duration-300 ease-out hover:scale-105 hover:-translate-y-1">
                <DiscordCard key={mode} mode={mode} />
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-[#111214]/50 border border-slate-200 dark:border-white/10 rounded-full p-1 gap-1 shadow-sm backdrop-blur-sm">
                <button
                    onClick={() => setMode('video')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${mode === 'video'
                        ? 'bg-white dark:bg-[#5865F2] text-slate-900 dark:text-white shadow-md'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                >
                    <Monitor size={14} />
                    <span>Video</span>
                </button>
                <button
                    onClick={() => setMode('music')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${mode === 'music'
                        ? 'bg-white dark:bg-[#5865F2] text-slate-900 dark:text-white shadow-md'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                >
                    <Music size={14} />
                    <span>Music</span>
                </button>
            </div>
        </div>
    );
}
