"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

    // Filter suggestions based on input
    const suggestions = useMemo(() => {
        if (!inputValue) return [];
        const query = inputValue.toLowerCase();
        return allVersions.filter(v => v.version.toLowerCase().includes(query));
    }, [inputValue, allVersions]);

    const displayedSuggestions = showAllSuggestions ? suggestions : suggestions.slice(0, 5);
    const hiddenCount = suggestions.length - displayedSuggestions.length;

    // Main View Logic
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
    };

    const handleClear = () => {
        setInputValue("");
        setSelectedVersion(null);
        setIsFocused(false);
        setShowAllSuggestions(false);
    };

    return (
        <div className="w-full space-y-8">
            {/* Header & Search Row */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-50">
                <div ref={headerRef} className="reveal">
                    <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#FF9500] mb-3">
                        History
                    </span>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Changelog</h2>
                    <p className="text-[14px] text-[#71717a] mt-1">History of updates and improvements.</p>
                </div>

                {/* Search Input */}
                <div className="relative max-w-md w-full md:w-80">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#52525b]">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Jump to version..."
                            value={inputValue}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                setShowAllSuggestions(false);
                                if (!e.target.value) setSelectedVersion(null);
                            }}
                            className="pl-10 pr-10 py-2.5 w-full rounded-lg bg-[#111113] border border-white/[0.06] text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9500]/30 focus:border-[#FF9500]/30 transition-all placeholder:text-[#52525b] text-white"
                        />
                        {inputValue && (
                            <button
                                onClick={handleClear}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#52525b] hover:text-[#a1a1aa]"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Suggestions Dropdown */}
                    {isFocused && inputValue && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#111113] border border-white/[0.06] rounded-lg shadow-xl overflow-hidden z-50">
                            <ul className="max-h-64 overflow-y-auto">
                                {displayedSuggestions.map((ver) => (
                                    <li
                                        key={ver.version}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleSelect(ver.version);
                                        }}
                                        className="px-4 py-3 hover:bg-white/[0.04] cursor-pointer flex justify-between items-center group transition-colors border-b border-white/[0.04] last:border-0"
                                    >
                                        <span className="text-sm font-medium text-[#a1a1aa] group-hover:text-[#FF9500] transition-colors">
                                            {ver.version}
                                        </span>
                                        <span className="text-xs text-[#52525b] font-mono">
                                            {ver.date}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            {hiddenCount > 0 && (
                                <div
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        setShowAllSuggestions(true);
                                    }}
                                    className="px-4 py-2 bg-white/[0.02] text-xs text-center text-[#FF9500] font-medium cursor-pointer hover:underline border-t border-white/[0.04] flex items-center justify-center gap-1"
                                >
                                    <span>Show {hiddenCount} more versions...</span>
                                    <ChevronDown size={12} />
                                </div>
                            )}
                        </div>
                    )}
                    {isFocused && inputValue && suggestions.length === 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#111113] border border-white/[0.06] rounded-lg shadow-xl p-4 text-center text-sm text-[#52525b]">
                            No versions found.
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                {visibleVersions.map((ver, i) => {
                    const isLatest = ver.version === allVersions[0].version;
                    const isSelected = ver.version === selectedVersion;

                    return (
                        <div key={ver.version} className="relative group">
                            {/* Timeline Line */}
                            {i !== visibleVersions.length - 1 && (
                                <div className="absolute left-[19px] top-12 bottom-[-24px] w-[2px] bg-white/[0.04]"></div>
                            )}

                            <div className="flex gap-6">
                                {/* Version Node */}
                                <div className="relative shrink-0 w-10 h-10 rounded-full bg-[#111113] border-4 border-[#09090b] shadow-sm flex items-center justify-center z-10">
                                    <span className={`w-3 h-3 rounded-full transition-colors duration-300 
                                        ${isLatest ? 'bg-green-500' : ''}
                                        ${!isLatest && isSelected ? 'bg-[#FF9500] ring-4 ring-[#FF9500]/20' : ''}
                                        ${!isLatest && !isSelected ? 'bg-[#52525b]' : ''}
                                    `}></span>
                                </div>

                                {/* Content Card */}
                                <div className={`flex-1 bg-[#111113] border rounded-xl p-6 transition-all duration-500
                                    ${isSelected
                                        ? 'border-[#FF9500]/30 ring-1 ring-[#FF9500]/20 shadow-[0_0_30px_rgba(255,149,0,0.08)]'
                                        : 'border-white/[0.06]'
                                    }
                                `}>
                                    <div className="flex items-baseline justify-between mb-4 border-b border-white/[0.06] pb-3">
                                        <div className="flex items-center gap-3">
                                            <h3 className={`text-lg font-bold transition-colors duration-300 
                                                ${isLatest ? 'text-green-400' : ''} 
                                                ${!isLatest && isSelected ? 'text-[#FF9500]' : ''}
                                                ${!isLatest && !isSelected ? 'text-white' : ''}
                                            `}>
                                                {ver.version}
                                            </h3>
                                            {isLatest && (
                                                <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-green-400 text-[11px] font-bold border border-green-500/20">
                                                    LATEST
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[12px] font-mono text-[#52525b]">{ver.date}</span>
                                    </div>

                                    {/* Markdown Content */}
                                    <div className="max-w-none text-[#a1a1aa] text-sm leading-relaxed">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                /* eslint-disable @typescript-eslint/no-unused-vars */
                                                h1: ({ node: _node, ...props }) => <h5 className="font-bold text-white mt-4 mb-2" {...props} />,
                                                h2: ({ node: _node, ...props }) => <h5 className="font-bold text-white mt-4 mb-2" {...props} />,
                                                h3: ({ node: _node, ...props }) => <h5 className="font-bold text-white mt-4 mb-2" {...props} />,
                                                strong: ({ node: _node, ...props }) => <span className="font-bold text-white" {...props} />,
                                                ul: ({ node: _node, ...props }) => <ul className="list-none space-y-2 mb-4 pl-0" {...props} />,
                                                li: ({ node: _node, ...props }) => (
                                                    <li className="flex items-start gap-2" {...props}>
                                                        <span className="mt-2 w-1.5 h-1.5 bg-[#FF9500]/40 rounded-full shrink-0 block" />
                                                        <span className="flex-1">{props.children}</span>
                                                    </li>
                                                ),
                                                p: ({ node: _node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                                                code: ({ node: _node, ...props }) => <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-[12px] font-mono text-[#fafafa] border border-white/[0.06]" {...props} />,
                                                /* eslint-enable @typescript-eslint/no-unused-vars */
                                            }}
                                        >
                                            {ver.rawContent}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination Hint */}
            {!selectedVersion && allVersions.length > 3 && (
                <div className="text-center text-[12px] text-[#3f3f46] mt-8">
                    Showing 3 latest versions. Use search to jump to older history.
                </div>
            )}
        </div>
    );
}
