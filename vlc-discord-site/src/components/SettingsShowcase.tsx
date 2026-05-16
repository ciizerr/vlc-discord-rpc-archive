"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Settings2,
    Image as ImageIcon,
    Type,
    Minimize2,
    Palette,
    Search,
    Music,
    Film,
    MonitorPlay
} from "lucide-react";
import DiscordCard, { ModSettings } from "./DiscordCard";

export default function SettingsShowcase() {
    const [mode, setMode] = useState<'video' | 'music'>('video');

    const [settings, setSettings] = useState<ModSettings>({
        showCoverArt: true,
        showQualityTags: true,
        minimalMode: false,
        buttonLabel: "Search This",
        theme: "",
        musicLabel: "Title"
    });

    const toggleSetting = (key: keyof ModSettings) => {
        setSettings(prev => ({
            ...prev,
            [key]: typeof prev[key] === 'boolean' ? !prev[key] : prev[key]
        }));
    };

    const updateSetting = <K extends keyof ModSettings>(key: K, value: ModSettings[K]) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <section id="try-it" className="relative py-24 overflow-hidden bg-[#09090b]">
            {/* Background elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl pointer-events-none opacity-20">
                <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-[#FF9500]/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[5%] w-72 h-72 bg-[#5865F2]/20 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6">
                <div className="flex flex-col items-center text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[#FF9500] text-[12px] font-bold uppercase tracking-widest mb-6"
                    >
                        <Settings2 size={14} />
                        Interactive Customization
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6"
                    >
                        Your status, <span className="text-[#FF9500]">your rules.</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-[#a1a1aa] max-w-2xl"
                    >
                        Preview exactly how your Discord status will look. Tweak the settings here to see how the mod adapts to your preferences.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    {/* Left: Settings Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/[0.02] border border-white/[0.08] rounded-3xl p-8 backdrop-blur-xl relative"
                    >
                        {/* Doodle Arrow - Moved further left and adjusted rotation to avoid clipping */}
                        <div className="absolute -top-16 -left-6 hidden xl:block pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, rotate: -95, scale: 0.8 }}
                                whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.8, duration: 1.5, type: "spring" }}
                                className="relative p-4"
                            >
                                <span className="absolute -top-0 left-0 text-[#FF9500] font-bold text-sm tracking-wide rotate-[-25deg] whitespace-nowrap" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", cursive' }}>
                                    Try tweaking it!
                                </span>
                                <svg width="140" height="100" viewBox="0 0 140 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40">
                                    <path
                                        d="M20 20C40 20 50 60 70 50C90 40 60 20 50 40C40 60 80 80 110 70"
                                        stroke="#FF9500"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeDasharray="6 8"
                                    />
                                    <path d="M105 60L118 72L102 80" stroke="#FF9500" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </motion.div>
                        </div>

                        <div className="space-y-8">
                            {/* Mode Toggle */}
                            <div className="flex p-1 bg-black/40 rounded-2xl border border-white/[0.05]">
                                <button
                                    onClick={() => setMode('video')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'video' ? 'bg-[#FF9500] text-[#09090b]' : 'text-[#52525b] hover:text-white'}`}
                                >
                                    <Film size={16} /> Video Mode
                                </button>
                                <button
                                    onClick={() => setMode('music')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'music' ? 'bg-[#FF9500] text-[#09090b]' : 'text-[#52525b] hover:text-white'}`}
                                >
                                    <Music size={16} /> Music Mode
                                </button>
                            </div>

                            {/* Switches Grid */}
                            <div className="grid grid-cols-1 gap-4">
                                <SettingSwitch
                                    label="Cover Art"
                                    description="Web & local artwork search"
                                    icon={<ImageIcon size={18} />}
                                    active={settings.showCoverArt}
                                    onToggle={() => toggleSetting('showCoverArt')}
                                />
                                <SettingSwitch
                                    label="Quality Tags"
                                    description="Resolution & HDR badges"
                                    icon={<MonitorPlay size={18} />}
                                    active={settings.showQualityTags}
                                    onToggle={() => toggleSetting('showQualityTags')}
                                />
                                <SettingSwitch
                                    label="Minimal Mode"
                                    description="Hide play/pause badge"
                                    icon={<Minimize2 size={18} />}
                                    active={settings.minimalMode}
                                    onToggle={() => toggleSetting('minimalMode')}
                                />
                            </div>

                            {/* Dropdowns / Inputs */}
                            <div className="space-y-6 pt-4 border-t border-white/[0.05]">
                                <div className="space-y-3">
                                    <label className="text-[12px] font-black text-[#3f3f46] uppercase tracking-widest flex items-center gap-2">
                                        <Palette size={14} /> Icon Theme
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(['', 'dark_'] as const).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => updateSetting('theme', t)}
                                                className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${settings.theme === t ? 'bg-white/[0.05] border-[#FF9500] text-white' : 'bg-transparent border-white/[0.05] text-[#52525b] hover:border-white/[0.2]'}`}
                                            >
                                                {t === '' ? 'Classic Orange' : 'Dark Mode'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[12px] font-black text-[#3f3f46] uppercase tracking-widest flex items-center gap-2">
                                        <Search size={14} /> Button Label
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.buttonLabel}
                                        onChange={(e) => updateSetting('buttonLabel', e.target.value)}
                                        className="w-full bg-black/40 border border-white/[0.05] rounded-xl px-4 py-3 text-white text-sm font-bold focus:outline-none focus:border-[#FF9500]/50 transition-colors"
                                        maxLength={25}
                                    />
                                </div>

                                {mode === 'music' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="space-y-3"
                                    >
                                        <label className="text-[12px] font-black text-[#3f3f46] uppercase tracking-widest flex items-center gap-2">
                                            <Type size={14} /> Activity Name
                                        </label>
                                        <div className="flex gap-2">
                                            {(['Title', 'Artist', 'Album'] as const).map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => updateSetting('musicLabel', opt)}
                                                    className={`flex-1 py-2 rounded-lg text-[12px] font-black border transition-all ${settings.musicLabel === opt ? 'bg-[#FF9500]/10 border-[#FF9500]/50 text-[#FF9500]' : 'bg-transparent border-white/[0.05] text-[#52525b]'}`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Preview Area */}
                    <div className="flex flex-col items-center justify-center relative min-h-[450px]">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 px-4 py-2 bg-[#FF9500] text-[#09090b] text-[11px] font-black uppercase tracking-[0.2em] rounded-full shadow-[0_0_40px_rgba(255,149,0,0.3)] z-30"
                        >
                            Live Preview
                        </motion.div>

                        <div className="relative group">
                            {/* Card Decoration */}
                            <div className="absolute inset-0 bg-[#FF9500]/10 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={`${mode}-${JSON.stringify(settings)}`}
                                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98, y: -10 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="relative z-20 scale-110 md:scale-125"
                                >
                                    <DiscordCard mode={mode} settings={settings} />
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Description of current state */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-20 text-center max-w-sm"
                        >
                            <p className="text-[13px] font-bold text-[#3f3f46] leading-relaxed">
                                {settings.minimalMode
                                    ? "Minimal mode hides the small status badge to keep your artwork clean."
                                    : "Standard mode shows play/pause status in the corner of the media icon."}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Additional Settings Note */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-6xl mx-auto px-6 mt-24 pt-24 border-t border-white/[0.05]"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <h3 className="text-white font-bold text-lg">Technical Logic</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#FF9500] shrink-0" />
                                <p className="text-[13px] text-[#71717a] leading-relaxed">
                                    <strong className="text-[#a1a1aa]">Metadata Cleaner:</strong> Automatically strips scene tags (WEB-DL, x265) and piracy URLs from filenames.
                                </p>
                            </li>
                            <li className="flex gap-3">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#FF9500] shrink-0" />
                                <p className="text-[13px] text-[#71717a] leading-relaxed">
                                    <strong className="text-[#a1a1aa]">Local Filters:</strong> Keep title cleaning offline to ensure 100% privacy and zero external requests.
                                </p>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-white font-bold text-lg">Extra Metadata</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#FF9500] shrink-0" />
                                <p className="text-[13px] text-[#71717a] leading-relaxed">
                                    <strong className="text-[#a1a1aa]">Chapter Support:</strong> Show the current chapter number for movies and anime.
                                </p>
                            </li>
                            <li className="flex gap-3">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#FF9500] shrink-0" />
                                <p className="text-[13px] text-[#71717a] leading-relaxed">
                                    <strong className="text-[#a1a1aa]">Audio Language:</strong> Displays the active audio track language (e.g., EN, JP) in your status.
                                </p>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-white font-bold text-lg">System Features</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#FF9500] shrink-0" />
                                <p className="text-[13px] text-[#71717a] leading-relaxed">
                                    <strong className="text-[#a1a1aa]">Windows Toasts:</strong> Get a native Windows notification whenever a new track or movie starts.
                                </p>
                            </li>
                            <li className="flex gap-3">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-[#FF9500] shrink-0" />
                                <p className="text-[13px] text-[#71717a] leading-relaxed">
                                    <strong className="text-[#a1a1aa]">Custom Port:</strong> Easily adjust the VLC communication port if you have a non-standard setup.
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

function SettingSwitch({ label, description, icon, active, onToggle }: {
    label: string,
    description: string,
    icon: React.ReactNode,
    active: boolean,
    onToggle: () => void
}) {
    return (
        <button
            onClick={onToggle}
            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${active ? 'bg-white/[0.04] border-white/[0.15]' : 'bg-transparent border-white/[0.05] hover:border-white/[0.1]'}`}
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${active ? 'bg-[#FF9500] text-[#09090b]' : 'bg-white/[0.05] text-[#52525b]'}`}>
                {icon}
            </div>
            <div className="flex-1">
                <h4 className={`text-sm font-bold transition-colors ${active ? 'text-white' : 'text-[#a1a1aa]'}`}>{label}</h4>
                <p className="text-[11px] text-[#52525b] font-medium">{description}</p>
            </div>
            <div className={`w-10 h-6 rounded-full relative transition-colors ${active ? 'bg-[#FF9500]' : 'bg-white/[0.05]'}`}>
                <motion.div
                    animate={{ x: active ? 18 : 4 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                />
            </div>
        </button>
    );
}
