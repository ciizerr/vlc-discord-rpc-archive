"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, Heart, ExternalLink } from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative mt-32 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <Image src="/assets/vlc-discord-icon.png" alt="Logo" width={32} height={32} className="rounded-lg" />
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
                                href="https://discord.com/servers/windhawk-923944342991818753"
                                target="_blank"
                                className="text-slate-400 hover:text-[#5865F2] transition-colors"
                            >
                                <svg
                                    role="img"
                                    viewBox="0 0 24 24"
                                    width="20"
                                    height="20"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
                                </svg>
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
                                <Link href="https://discord.com/servers/windhawk-923944342991818753" className="hover:text-orange-500 transition-colors">
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

                <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-center text-xs text-slate-400 dark:text-slate-600 mb-4">
                        Not affiliated with VideoLAN, Discord, or Windhawk. All trademarks are property of their respective owners.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-slate-500 dark:text-slate-500 text-sm">
                            &copy; {new Date().getFullYear()} VLC Discord RPC. MIT License.
                        </p>
                        <p className="text-slate-500 dark:text-slate-500 text-sm flex items-center gap-1">
                            Made with <Heart size={14} className="text-red-500 fill-red-500" /> for the community.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
