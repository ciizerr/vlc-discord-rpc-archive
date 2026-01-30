"use client";

import { useMemo, useState } from "react";
// import { useTheme } from "next-themes";
import { Search, X, ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChangelogVersion {
    version: string;
    date: string;
    rawContent: string;
}

export default function ChangelogViewer({ markdown }: { markdown: string }) {
    const [inputValue, setInputValue] = useState("");
    const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [showAllSuggestions, setShowAllSuggestions] = useState(false);

    // Parse Markdown into Versions
    const allVersions = useMemo(() => {
        const versions: ChangelogVersion[] = [];
        // Split by "## " headers (assumed to be H2)
        // Regex lookahead to split but keep delimiter? Or just split and rebuild?
        // Simpler: Split by newlines and state machine, as before, but collecting lines.

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
            // Header: ## v1.0.3 (2025-01-29)
            if (line.startsWith('## ')) {
                pushVersion();
                contentBuffer = []; // Reset buffer

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
                // Anchor View: Selected + Next 2
                return allVersions.slice(index, index + 3);
            }
        }
        // Default View: Latest 3
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
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Changelog</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">History of updates and improvements.</p>
                </div>

                {/* Search Input Container */}
                <div className="relative max-w-md w-full md:w-80">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Jump to version..."
                            value={inputValue}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow click
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                setShowAllSuggestions(false); // Reset on type
                                if (!e.target.value) setSelectedVersion(null);
                            }}
                            className="pl-10 pr-10 py-2 w-full rounded-lg bg-slate-100 dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-slate-500 dark:text-slate-200 text-slate-900 dark:text-white"
                        />
                        {inputValue && (
                            <button
                                onClick={handleClear}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Suggestions Dropdown */}
                    {isFocused && inputValue && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                            <ul className="max-h-64 overflow-y-auto">
                                {displayedSuggestions.map((ver) => (
                                    <li
                                        key={ver.version}
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            handleSelect(ver.version);
                                        }}
                                        className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex justify-between items-center group transition-colors border-b border-slate-100 dark:border-slate-800/50 last:border-0"
                                    >
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-orange-500 transition-colors">
                                            {ver.version}
                                        </span>
                                        <span className="text-xs text-slate-400 font-mono">
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
                                    className="px-4 py-2 bg-slate-50 dark:bg-slate-900/50 text-xs text-center text-orange-500 font-medium cursor-pointer hover:underline border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1"
                                >
                                    <span>Show {hiddenCount} more versions...</span>
                                    <ChevronDown size={12} />
                                </div>
                            )}
                        </div>
                    )}
                    {isFocused && inputValue && suggestions.length === 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl p-4 text-center text-sm text-slate-500">
                            No versions found.
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-8">
                {visibleVersions.map((ver, i) => {
                    // Check if this is the absolute latest version in the entire changelog
                    const isLatest = ver.version === allVersions[0].version;
                    const isSelected = ver.version === selectedVersion;

                    return (
                        <div key={ver.version} className="relative group">
                            {/* Timeline Line */}
                            {i !== visibleVersions.length - 1 && (
                                <div className="absolute left-[19px] top-12 bottom-[-32px] w-0.5 bg-slate-200 dark:bg-slate-800"></div>
                            )}

                            <div className="flex gap-6">
                                {/* Version Node */}
                                {/* Uniform Node Style */}
                                <div className="relative shrink-0 w-10 h-10 rounded-full bg-slate-100 dark:bg-[#161b22] border-4 border-white dark:border-[#0d1117] shadow-sm flex items-center justify-center z-10 transition-colors duration-300">
                                    <span className={`w-3 h-3 rounded-full transition-colors duration-300 
                                        ${isLatest ? 'bg-green-500' : ''}
                                        ${!isLatest && isSelected ? 'bg-orange-500 ring-4 ring-orange-500/20' : ''}
                                        ${!isLatest && !isSelected ? 'bg-slate-400 dark:bg-slate-600' : ''}
                                    `}></span>
                                </div>

                                {/* Content Card */}
                                <div className={`flex-1 bg-white dark:bg-[#0d1117] border rounded-xl p-6 shadow-sm transition-all duration-500
                                    ${isSelected
                                        ? 'border-slate-200 dark:border-slate-800 ring-2 ring-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.15)] dark:shadow-[0_0_30px_rgba(249,115,22,0.1)] bg-orange-50 dark:bg-[#1a110a]'
                                        : 'border-slate-200 dark:border-slate-800'
                                    }
                                `}>
                                    <div className="flex items-baseline justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className={`text-xl font-bold transition-colors duration-300 
                                                ${isLatest ? 'text-green-600 dark:text-green-400' : ''} 
                                                ${!isLatest && isSelected ? 'text-orange-600 dark:text-orange-400' : ''}
                                                ${!isLatest && !isSelected ? 'text-slate-900 dark:text-white' : ''}
                                            `}>
                                                {ver.version}
                                            </h3>
                                            {isLatest && (
                                                <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 text-xs font-bold border border-green-200 dark:border-green-500/30">
                                                    LATEST
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-sm font-mono text-slate-500">{ver.date}</span>
                                    </div>

                                    {/* Markdown Content */}
                                    <div className="max-w-none text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                h1: ({ node: _node, ...props }) => <h5 className="font-bold text-slate-900 dark:text-slate-100 mt-4 mb-2" {...props} />,
                                                h2: ({ node: _node, ...props }) => <h5 className="font-bold text-slate-900 dark:text-slate-100 mt-4 mb-2" {...props} />,
                                                h3: ({ node: _node, ...props }) => <h5 className="font-bold text-slate-900 dark:text-slate-100 mt-4 mb-2" {...props} />,
                                                strong: ({ node: _node, ...props }) => <span className="font-bold text-slate-900 dark:text-slate-100" {...props} />,
                                                ul: ({ node: _node, ...props }) => <ul className="list-disk space-y-2 mb-4 pl-4" {...props} />,
                                                li: ({ node: _node, ...props }) => (
                                                    <li className="flex items-start gap-2" {...props}>
                                                        <span className="mt-2 w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full shrink-0 block" />
                                                        <span className="flex-1">{props.children}</span>
                                                    </li>
                                                ),
                                                p: ({ node: _node, ...props }) => <p className="mb-4 last:mb-0" {...props} />,
                                                code: ({ node: _node, ...props }) => <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs font-mono text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700" {...props} />,
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
                <div className="text-center text-xs text-slate-400 mt-8">
                    Showing 3 latest versions. Use search to jump to older history.
                </div>
            )}
        </div>
    );
}
