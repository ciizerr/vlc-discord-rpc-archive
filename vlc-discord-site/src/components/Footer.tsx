"use client";

import React from "react";
import Link from "next/link";
import { Github, Disc, Heart, ExternalLink } from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative mt-32 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">
                                V
                            </div>
                            <span className="font-bold text-xl text-slate-900 dark:text-white">VLC RPC</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                            The seamless Discord integration for VLC Media Player. Open source, lightweight, and community-driven.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                href="https://github.com/ciizerr/vlc-discord-rpc-archive"
                                target="_blank"
                                className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                <Github size={20} />
                            </Link>
                            <Link
                                href="#"
                                className="text-slate-400 hover:text-[#5865F2] transition-colors"
                            >
                                <Disc size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                            <li>
                                <Link href="#features" className="hover:text-orange-500 transition-colors">Features</Link>
                            </li>
                            <li>
                                <Link href="#installation" className="hover:text-orange-500 transition-colors">Installation</Link>
                            </li>
                            <li>
                                <Link href="/archive" className="hover:text-orange-500 transition-colors">Archive</Link>
                            </li>
                            <li>
                                <Link href="#changelog" className="hover:text-orange-500 transition-colors">Changelog</Link>
                            </li>
                            <li>
                                <Link href="#faq" className="hover:text-orange-500 transition-colors">FAQ</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-6">Community</h4>
                        <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                            <li>
                                <Link href="https://github.com/ciizerr/vlc-discord-rpc-archive/issues" target="_blank" className="hover:text-orange-500 transition-colors">
                                    Report Issues
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-orange-500 transition-colors">
                                    Discord Server
                                </Link>
                            </li>
                            <li>
                                <Link href="https://github.com/ciizerr/vlc-discord-rpc-archive/graphs/contributors" target="_blank" className="hover:text-orange-500 transition-colors">
                                    Contributors
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-6">Resources</h4>
                        <ul className="space-y-4 text-sm text-slate-500 dark:text-slate-400">
                            <li>
                                <Link href="https://windhawk.net" target="_blank" className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                                    Windhawk.net
                                    <ExternalLink size={12} />
                                </Link>
                            </li>
                            <li>
                                <Link href="https://videolan.org" target="_blank" className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                                    VLC Media Player
                                    <ExternalLink size={12} />
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 dark:text-slate-500 text-sm">
                        &copy; {new Date().getFullYear()} VLC Discord RPC. MIT License.
                    </p>
                    <p className="text-slate-500 dark:text-slate-500 text-sm flex items-center gap-1">
                        Made with <Heart size={14} className="text-red-500 fill-red-500" /> for the community.
                    </p>
                </div>
            </div>
        </footer>
    );
}
