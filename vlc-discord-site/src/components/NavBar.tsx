"use client";

import React from "react";
import Link from "next/link";
import GradualBlur from "@/components/GradualBlur";

export default function NavBar() {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
            <GradualBlur
                position="top"
                height="7rem"
                preset="header"
                className="w-full flex items-center"
                strength={2}
                opacity={1}

            >
                <div className="w-full max-w-6xl mx-auto px-6 flex items-center justify-between pointer-events-auto h-full">
                    <Link href="/" className="font-bold text-lg tracking-tighter text-white hover:text-orange-500 transition-colors">
                        VLC RPC
                    </Link>

                    <nav className="flex gap-6 text-sm font-medium text-slate-400">
                        <Link href="/" className="hover:text-white transition-colors">
                            Home
                        </Link>
                        <Link href="/archive" className="hover:text-white transition-colors">
                            Archive
                        </Link>
                        <Link href="https://windhawk.net/mods/vlc-discord-rpc" target="_blank" className="hover:text-white transition-colors">
                            Windhawk
                        </Link>
                    </nav>
                </div>
            </GradualBlur>
        </div>
    );
}
