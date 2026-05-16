"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Gamepad2, Music } from "lucide-react";

type PlaybackState = 'playing' | 'paused' | 'stopped';
type Mode = 'video' | 'music';

const STATES: PlaybackState[] = ['playing', 'paused', 'stopped'];

export interface ModSettings {
    showCoverArt: boolean;
    showQualityTags: boolean;
    minimalMode: boolean;
    buttonLabel: string;
    theme: "" | "dark_";
    musicLabel: "Title" | "Artist" | "Album";
}

interface DiscordCardProps {
    mode: Mode;
    settings?: ModSettings;
}

// Music mode data
const musicData = {
    artist: "Chilli Beans.",
    track: "Raise",
    album: "for you",
    duration: 3 * 60 + 34, // 03:34
    timestamp: 48 // 00:48
};

// Video mode data
const videoData = {
    title: "IT Welcome to Derry",
    details: "S01E07 • Ch 1 • EN",
    duration: 61 * 60 + 3 // 01:01:03
};

export default function DiscordCard({ mode, settings }: DiscordCardProps) {
    const [status, setStatus] = useState<PlaybackState>('playing');

    const defaultSettings: ModSettings = {
        showCoverArt: true,
        showQualityTags: true,
        minimalMode: false,
        buttonLabel: "Search This",
        theme: "",
        musicLabel: "Title"
    };

    const s = settings || defaultSettings;

    const [elapsedTime, setElapsedTime] = useState(
        mode === 'music' ? musicData.timestamp : 21 * 60 + 28
    );

    const totalDuration = mode === 'music' ? musicData.duration : videoData.duration;

    // Timer logic (Elapsed time simulation)
    useEffect(() => {
        const timer = setInterval(() => {
            if (status === 'playing') {
                setElapsedTime((prev) => (prev < totalDuration ? prev + 1 : 0));
            } else if (status === 'stopped') {
                setElapsedTime((prev) => prev + 1);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [status, totalDuration]);

    // State cycling logic (demo effect)
    useEffect(() => {
        const cycler = setInterval(() => {
            setStatus(prev => {
                const nextIdx = (STATES.indexOf(prev) + 1) % STATES.length;
                return STATES[nextIdx];
            });
        }, 5000);
        return () => clearInterval(cycler);
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        if (h > 0) return `${h}:${m}:${s}`;
        return `${parseInt(m)}:${s}`;
    };

    const themePrefix = s.theme;
    const folder = themePrefix === "dark_" ? "dark_" : "default";
    const vlcIcon = `/assets/${folder}/${themePrefix}vlc_icon.png`;

    const getStatusIcon = () => {
        switch (status) {
            case 'playing': return `/assets/${folder}/${themePrefix}play_icon.png`;
            case 'paused': return `/assets/${folder}/${themePrefix}pause_icon.png`;
            case 'stopped': return `/assets/${folder}/${themePrefix}stop_icon.png`;
            default: return vlcIcon;
        }
    };

    const progressPercent = Math.min((elapsedTime / totalDuration) * 100, 100);

    const isStopped = status === 'stopped';
    const isPaused = status === 'paused';

    const headerText = isStopped
        ? 'Playing'
        : (mode === 'music' 
            ? (s.musicLabel === "Title" ? `Listening to ${musicData.track}` : s.musicLabel === "Artist" ? `Listening to ${musicData.artist}` : `Listening to ${musicData.album}`)
            : `Watching ${videoData.title}`);

    let title, subtitle, subDetailText;

    if (mode === 'music') {
        title = isStopped ? 'VLC Media Player' : `${musicData.track}`;
        subtitle = isStopped ? 'Idling' : `by ${musicData.artist} ${!isStopped ? `(${status === 'playing' ? 'Playing' : 'Paused'})` : ''}`;
        subDetailText = isStopped ? 'Waiting for media...' : musicData.album;
    } else {
        const tags = s.showQualityTags ? ' • 4K • HDR' : '';
        title = isStopped ? 'VLC Media Player' : `${videoData.title}${tags}`;
        subtitle = isStopped ? 'Idling' : videoData.details;
        const stateText = isStopped ? 'Waiting for media...' : `(${status === 'playing' ? 'Playing' : 'Paused'})`;
        const detailText = isStopped ? subtitle : `${subtitle} ${stateText}`;
        subtitle = detailText;
        subDetailText = isStopped ? 'Waiting for media...' : null;
    }

    const imageSrc = s.showCoverArt 
        ? (mode === 'music'
            ? (isStopped ? vlcIcon : "/album_art.png")
            : (isStopped ? vlcIcon : "/album_art_movie.webp"))
        : vlcIcon;

    return (
        <div className="bg-[#111214] text-white p-4 rounded-lg w-[380px] shadow-2xl border border-white/[0.06] font-sans relative overflow-hidden text-left">

            {/* Header */}
            <h3 className="text-[12px] font-bold text-[#b5bac1] uppercase mb-4 tracking-wide antialiased">
                {headerText}
            </h3>

            <div className="flex gap-4 items-start">
                {/* Large Image */}
                <div className="relative shrink-0">
                    <div className="w-[80px] h-[80px] rounded-[12px] bg-black overflow-hidden relative">
                        <Image src={imageSrc} width={80} height={80} alt="Media" className="object-cover" />
                    </div>
                    {/* Small Image (Circle Status) */}
                    {!s.minimalMode && (
                        <div className="absolute -bottom-1 -right-1 w-[28px] h-[28px] rounded-full bg-[#111214] border-[4px] border-[#111214] flex items-center justify-center overflow-hidden">
                            <Image src={getStatusIcon()} width={28} height={28} alt="Status" className="rounded-full bg-transparent" />
                        </div>
                    )}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between h-[80px]">
                    <div className="flex flex-col gap-0.5">
                        <div className="text-[14px] font-bold text-[#f2f3f5] truncate leading-tight hover:underline cursor-pointer">
                            {title}
                        </div>
                        <div className="text-[13px] text-[#b5bac1] truncate leading-tight">
                            {subtitle}
                        </div>
                        {subDetailText && (
                            <div className="text-[13px] text-[#b5bac1] truncate leading-tight">
                                {subDetailText}
                            </div>
                        )}
                    </div>

                    {/* Time & Progress Bar - Only when Playing */}
                    {status === 'playing' && (
                        <div className="flex items-center gap-2 text-[12px] text-[#b5bac1] font-mono mt-auto">
                            <span>{formatTime(elapsedTime)}</span>
                            <div className="flex-1 h-[4px] bg-[#404249] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white rounded-full transition-all duration-1000 ease-linear"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <span>{formatTime(totalDuration)}</span>
                        </div>
                    )}

                    {/* Idle/Paused Timer */}
                    {(isStopped || isPaused) && (
                        <div className="text-[13px] mt-auto font-mono text-[#23a559] flex items-center gap-2">
                            {mode === 'music' ? <Music size={16} className="opacity-80" /> : <Gamepad2 size={16} className="opacity-80" />}
                            {formatTime(elapsedTime)} elapsed
                        </div>
                    )}
                </div>
            </div>

            {/* Buttons */}
            <div className="mt-4">
                <button
                    onClick={() => window.open(`https://www.google.com/search?q=${mode === 'music' ? 'Chilli+Beans+Raise' : 'IT+Welcome+to+Derry'}`, "_blank")}
                    className="w-full h-[32px] rounded bg-[#383a40] text-sm text-[#f2f3f5] font-medium hover:bg-[#474a52] transition-colors truncate flex items-center justify-center hover:underline cursor-pointer"
                >
                    {s.buttonLabel}
                </button>
            </div>
        </div>
    );
}
