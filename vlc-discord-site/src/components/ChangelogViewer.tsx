"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { Search, X, ChevronDown, Calendar, Tag, Rocket, History, Info } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";

interface ChangelogVersion {
    version: string;
    date: string;
    rawContent: string;
}

function useReveal() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add("visible");
                    observer.unobserve(el);
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return ref;
}

export default function ChangelogViewer({ markdown }: { markdown: string }) {
    const [inputValue, setInputValue] = useState("");
    const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [showAllSuggestions, setShowAllSuggestions] = useState(false);
    const headerRef = useReveal();

    // Parse Markdown into Versions
    const allVersions = useMemo(() => {
        const versions: ChangelogVersion[] = [];
        const lines = markdown.split('\n');
        let currentVersion: ChangelogVersion | null = null;
        let contentBuffer: string[] = [];

        const pushVersion = () => {
            if (currentVersion) {
                currentVersion.rawContent = contentBuffer.join('\n').trim();
                versions.push(currentVersion);
            }
        };

        lines.forEach(line => {
            if (line.startsWith('## ')) {
                pushVersion();
                contentBuffer = [];
                const match = line.match(/## (v\S+) \(([^)]+)\)/);
                const version = match ? match[1] : line.replace('## ', '').trim();
                const date = match ? match[2] : '';
                currentVersion = { version, date, rawContent: "" };
            } else {
                if (currentVersion) {
                    contentBuffer.push(line);
                }
            }
        });

        pushVersion();
        return versions;
    }, [markdown]);

    const suggestions = useMemo(() => {
        if (!inputValue) return [];
        const query = inputValue.toLowerCase();
        return allVersions.filter(v => v.version.toLowerCase().includes(query));
    }, [inputValue, allVersions]);

    const displayedSuggestions = showAllSuggestions ? suggestions : suggestions.slice(0, 5);
    const hiddenCount = suggestions.length - displayedSuggestions.length;

    const visibleVersions = useMemo(() => {
        if (selectedVersion) {
            const index = allVersions.findIndex(v => v.version === selectedVersion);
            if (index !== -1) {
                return allVersions.slice(index, index + 3);
            }
        }
        return allVersions.slice(0, 3);
    }, [selectedVersion, allVersions]);

    const handleSelect = (version: string) => {
        setInputValue(version);
        setSelectedVersion(version);
        setIsFocused(false);
        setShowAllSuggestions(false);
        
        // Scroll to the changelog section
        const section = document.getElementById('changelog');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full space-y-12">
            {/* --- Section Header --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-[60]">
                <div ref={headerRef} className="reveal">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-[#FF9500]/10 rounded-lg text-[#FF9500]">
                            <History size={18} />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FF9500]">
                            Release Stream
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                        Changelog
                    </h2>
                    <p className="text-[15px] text-[#71717a] mt-3 max-w-md leading-relaxed">
                        Track every improvement, optimization, and bug fix as we evolve the native VLC experience.
                    </p>
                </div>

                {/* --- Search / Version Picker --- */}
                <div className="relative w-full md:w-80 group/search">
                    <div className="relative z-10">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#52525b] group-focus-within/search:text-[#FF9500] transition-colors">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search version history..."
                            value={inputValue}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                setShowAllSuggestions(false);
                                if (!e.target.value) setSelectedVersion(null);
                            }}
                            className="pl-11 pr-10 py-3 w-full rounded-xl bg-[#111113] border border-white/[0.08] text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9500]/20 focus:border-[#FF9500]/30 transition-all placeholder:text-[#52525b] text-white shadow-lg group-hover/search:border-white/[0.15]"
                        />
                        <AnimatePresence>
                            {inputValue && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={() => {
                                        setInputValue("");
                                        setSelectedVersion(null);
                                    }}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#52525b] hover:text-[#FF9500] transition-colors"
                                >
                                    <X size={16} />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* --- Dropdown Suggestions --- */}
                    <AnimatePresence>
                        {isFocused && inputValue && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full left-0 right-0 mt-3 bg-[#111113] border border-white/[0.1] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[70] backdrop-blur-xl"
                            >
                                {suggestions.length > 0 ? (
                                    <>
                                        <ul className="max-h-64 overflow-y-auto">
                                            {displayedSuggestions.map((ver) => (
                                                <li
                                                    key={ver.version}
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        handleSelect(ver.version);
                                                    }}
                                                    className="px-5 py-3.5 hover:bg-white/[0.04] cursor-pointer flex justify-between items-center group transition-colors border-b border-white/[0.04] last:border-0"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Tag size={12} className="text-[#FF9500]/40 group-hover:text-[#FF9500]" />
                                                        <span className="text-sm font-semibold text-[#a1a1aa] group-hover:text-white transition-colors">
                                                            {ver.version}
                                                        </span>
                                                    </div>
                                                    <span className="text-[11px] text-[#52525b] font-mono group-hover:text-[#a1a1aa]">
                                                        {ver.date}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                        {hiddenCount > 0 && (
                                            <button
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    setShowAllSuggestions(true);
                                                }}
                                                className="w-full px-5 py-2.5 bg-white/[0.02] text-[11px] text-center text-[#FF9500] font-bold tracking-wider uppercase cursor-pointer hover:bg-white/[0.05] border-t border-white/[0.04] flex items-center justify-center gap-2"
                                            >
                                                <span>+ {hiddenCount} more versions</span>
                                                <ChevronDown size={12} />
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div className="p-8 text-center">
                                        <Info size={24} className="mx-auto mb-3 text-[#3f3f46]" />
                                        <p className="text-sm text-[#52525b]">No versions match your search.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* --- Release Timeline --- */}
            <div className="relative space-y-16">
                {/* Vertical Timeline Line */}
                <div className="absolute left-[20px] top-8 bottom-8 w-[1px] bg-gradient-to-b from-[#FF9500] via-white/[0.05] to-transparent z-0 hidden md:block" />

                {visibleVersions.map((ver, i) => {
                    const isLatest = ver.version === allVersions[0].version;
                    const isSelected = ver.version === selectedVersion;

                    return (
                        <motion.div 
                            key={ver.version}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="relative group/version"
                        >
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Left Side: Version Marker (Sticky-ish) */}
                                <div className="flex md:flex-col items-center gap-4 shrink-0 md:w-40 pt-2">
                                    <div className={`relative flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#09090b] shadow-2xl z-10 transition-transform duration-500 group-hover/version:scale-110 
                                        ${isLatest ? 'bg-gradient-to-br from-[#FF9500] to-[#FF9500]/80' : 'bg-[#111113]'}
                                        ${isSelected ? 'ring-4 ring-[#FF9500]/20 border-[#FF9500]/40' : ''}
                                    `}>
                                        {isLatest ? (
                                            <Rocket size={16} className="text-[#09090b]" />
                                        ) : (
                                            <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#FF9500]' : 'bg-[#3f3f46]'}`} />
                                        )}
                                    </div>
                                    
                                    <div className="flex flex-col md:items-center">
                                        <span className={`text-[13px] font-bold tracking-tight transition-colors duration-300
                                            ${isLatest ? 'text-[#FF9500]' : 'text-white/40 group-hover/version:text-white/60'}
                                            ${isSelected ? '!text-[#FF9500]' : ''}
                                        `}>
                                            {ver.version}
                                        </span>
                                        <div className="flex items-center gap-1.5 md:mt-1 text-[11px] font-medium text-[#52525b] whitespace-nowrap">
                                            <Calendar size={10} />
                                            {ver.date}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Content Card */}
                                <div className={`flex-1 relative bg-[#0d0d0f] border rounded-2xl p-6 md:p-8 transition-all duration-500
                                    ${isSelected 
                                        ? 'border-[#FF9500]/30 shadow-[0_30px_60px_-15px_rgba(255,149,0,0.1)] translate-x-1' 
                                        : 'border-white/[0.06] hover:border-white/[0.1] hover:bg-[#111113]'
                                    }
                                `}>
                                    {/* Latest Ribbon */}
                                    {isLatest && (
                                        <div className="absolute -top-3 right-8 px-3 py-1 rounded-full bg-[#FF9500] text-[#09090b] text-[10px] font-bold tracking-widest uppercase shadow-lg">
                                            Latest Stable
                                        </div>
                                    )}

                                    <div className="max-w-none prose prose-invert prose-sm">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                h1: ({ ...props }) => <h4 className="text-white font-bold mb-4 mt-2" {...props} />,
                                                h2: ({ ...props }) => <h4 className="text-white font-bold mb-4 mt-2" {...props} />,
                                                h3: ({ ...props }) => <h4 className="text-white font-bold mb-4 mt-2" {...props} />,
                                                strong: ({ ...props }) => <span className="text-[#FF9500] font-bold" {...props} />,
                                                ul: ({ ...props }) => <ul className="list-none space-y-3 mb-6 p-0" {...props} />,
                                                li: ({ ...props }) => (
                                                    <li className="flex items-start gap-3 text-[#a1a1aa] leading-relaxed group/li" {...props}>
                                                        <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#FF9500]/30 group-hover/li:bg-[#FF9500] transition-colors shrink-0" />
                                                        <span className="flex-1">{props.children}</span>
                                                    </li>
                                                ),
                                                code: ({ ...props }) => (
                                                    <code className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-[12px] font-mono text-[#FF9500]/90" {...props} />
                                                ),
                                                p: ({ ...props }) => <p className="mb-4 last:mb-0 text-[#71717a]" {...props} />
                                            }}
                                        >
                                            {ver.rawContent}
                                        </ReactMarkdown>
                                    </div>

                                    {/* Card Footer - Visual Accent */}
                                    <div className="mt-8 pt-6 border-t border-white/[0.04] flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <div className="w-2 h-2 rounded-full bg-[#28c840]/20 border border-[#28c840]/30" />
                                            <div className="w-2 h-2 rounded-full bg-white/[0.05] border border-white/[0.1]" />
                                        </div>
                                        <span className="text-[10px] font-bold text-[#3f3f46] uppercase tracking-widest">
                                            Internal Build Signed
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Pagination Hint */}
            {!selectedVersion && allVersions.length > 3 && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4 py-8"
                >
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />
                    <p className="text-[12px] font-medium text-[#52525b] uppercase tracking-widest">
                        End of recent stream
                    </p>
                    <button 
                        onClick={() => {
                            // Focus search to encourage exploration
                            const input = document.querySelector('input[placeholder*="Search version"]') as HTMLInputElement;
                            input?.focus();
                        }}
                        className="text-[13px] text-[#FF9500]/60 hover:text-[#FF9500] transition-colors font-semibold"
                    >
                        Search older releases →
                    </button>
                </motion.div>
            )}
        </div>
    );
}
