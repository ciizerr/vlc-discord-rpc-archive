"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type PlaybackState = 'playing' | 'paused' | 'stopped';

const STATES: PlaybackState[] = ['playing', 'paused', 'stopped'];

export default function DiscordCard() {
    const [status, setStatus] = useState<PlaybackState>('playing');
    const [timeLeft, setTimeLeft] = useState(105 * 60 + 20); // 01:45:20 in seconds
    const [elapsedTime, setElapsedTime] = useState(22); // Start at 22s for Idling

    // Timer logic (Countdown for playing, Elapsed for idling)
    useEffect(() => {
        const timer = setInterval(() => {
            if (status === 'playing') {
                setTimeLeft((prev) => (prev > 0 ? prev - 1 : 105 * 60 + 20));
            }
            if (status === 'stopped') {
                setElapsedTime((prev) => prev + 1);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [status]);

    // State cycling logic (demo effect)
    useEffect(() => {
        const cycler = setInterval(() => {
            setStatus(prev => {
                const nextIdx = (STATES.indexOf(prev) + 1) % STATES.length;
                return STATES[nextIdx];
            });
        }, 5000); // Change state every 5 seconds
        return () => clearInterval(cycler);
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        // If hours is 0, Discord usually shows M:SS, but let's stick to H:MM:SS or MM:SS based on magnitude
        if (h > 0) return `${h}:${m}:${s}`;
        return `${parseInt(m)}:${s}`;
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'playing': return '/assets/default/play_icon.png';
            case 'paused': return '/assets/default/pause_icon.png';
            case 'stopped': return '/assets/default/stop_icon.png';
            default: return '/assets/default/vlc_icon.png';
        }
    };

    // Content based on Reference Image
    const title = "VLC Media Player";
    let detailText = "";
    let stateText = "";
    let timeText = "";
    let showButton = true;

    if (status === 'stopped') {
        detailText = "Idling";
        stateText = "Waiting for media...";
        timeText = `${formatTime(elapsedTime)} elapsed`;
        showButton = false;
    } else {
        detailText = "Stranger Things (2016) • 4K";
        // Match reference: S05E03 • Ch 1 • EN (Playing/Paused)
        stateText = `S05E03 • Ch 1 • EN (${status === 'playing' ? 'Playing' : 'Paused'})`;
        // User asked for "left" for playing, reference shows green time.
        timeText = `${formatTime(timeLeft)} left`;
        showButton = true;
    }

    return (
        <div className="bg-[#111214] text-white p-4 rounded-lg w-[340px] shadow-2xl border border-[#1e1f22] font-sans relative overflow-hidden group text-left">

            {/* Decorative Glow */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-orange-500/10 blur-[50px] rounded-full pointer-events-none transition-opacity duration-1000 ${status === 'playing' ? 'opacity-100' : 'opacity-20'}`}></div>

            <h3 className="text-[11px] font-bold text-[#b5bac1] uppercase mb-3 tracking-wide antialiased">
                Playing a game
            </h3>

            <div className="flex gap-3 items-center">
                {/* Large Image (VLC Cone) */}
                <div className="relative">
                    <div className="w-[60px] h-[60px] rounded-[8px] bg-black overflow-hidden relative">
                        <Image src="/assets/default/vlc_icon.png" width={60} height={60} alt="VLC" className="object-cover" />
                    </div>
                    {/* Small Image (Circle Status) */}
                    <div className="absolute -bottom-1 -right-1 w-[24px] h-[24px] rounded-full bg-[#111214] border-[3px] border-[#111214] flex items-center justify-center overflow-hidden">
                        <Image src={getStatusIcon()} width={24} height={24} alt="Status" className="rounded-full bg-[#111214]" />
                    </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center h-[60px]">
                    <div className="text-[13px] font-bold text-[#f2f3f5] truncate leading-tight">{title}</div>
                    <div className="text-[13px] text-[#f2f3f5] truncate leading-tight">{detailText}</div>
                    <div className="text-[13px] text-[#f2f3f5] truncate leading-tight">{stateText}</div>
                    {status !== 'stopped' && (
                        <div className="text-[13px] text-[#f2f3f5] truncate leading-tight text-[#23a559]">{timeText}</div>
                    )}
                    {status === 'stopped' && (
                        <div className="text-[13px] text-[#f2f3f5] truncate leading-tight flex items-center gap-1">
                            {/* Green elapsed timer for idling as per reference */}
                            <span className="text-[#23a559]">{formatTime(elapsedTime)} elapsed</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Buttons */}
            {/* Buttons - Always rendered to preserve height */}
            <div className={`mt-3 space-y-2 ${showButton ? '' : 'invisible'}`}>
                <button
                    onClick={() => window.open("https://www.google.com/search?q=Stranger+Things+S05E03+ch1", "_blank")}
                    className="w-full h-8 rounded bg-[#383a40] text-sm text-white font-medium hover:bg-[#474a52] transition-colors truncate"
                    tabIndex={showButton ? 0 : -1}
                >
                    Search This
                </button>
            </div>
        </div>
    );
}
