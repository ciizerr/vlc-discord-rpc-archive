"use client";

import { useState } from "react";
import DiscordCard from "./DiscordCard";
import { Monitor, Music } from "lucide-react";

type Mode = 'video' | 'music';

export default function DiscordCardWrapper() {
    const [mode, setMode] = useState<Mode>('video');

    return (
        <div className="flex flex-col items-center gap-5">
            <div className="discord-card-container">
                <DiscordCard key={mode} mode={mode} />
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center bg-[#111113] border border-white/[0.06] rounded-lg p-1 gap-1">
                <button
                    onClick={() => setMode('video')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                        mode === 'video'
                            ? 'bg-[#FF9500] text-[#09090b]'
                            : 'text-[#a1a1aa] hover:text-white'
                    }`}
                >
                    <Monitor size={14} />
                    <span>Video</span>
                </button>
                <button
                    onClick={() => setMode('music')}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                        mode === 'music'
                            ? 'bg-[#FF9500] text-[#09090b]'
                            : 'text-[#a1a1aa] hover:text-white'
                    }`}
                >
                    <Music size={14} />
                    <span>Music</span>
                </button>
            </div>
        </div>
    );
}
