"use client";

import { useState, useSyncExternalStore as useCommonSyncExternalStore } from "react";

const subscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { Copy, ChevronDown, ChevronUp } from "lucide-react";

interface CodeViewerProps {
    code: string;
    language: string;
}

export default function CodeViewer({ code, language }: CodeViewerProps) {
    const { resolvedTheme } = useTheme();
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    // Prevent hydration mismatch by only rendering SyntaxHighlighter on client
    // useSyncExternalStore is the recommended way to handle "is client" checks without effects
    const mounted = useCommonSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
    );

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group">
            {/* Copy Button */}
            <button
                onClick={handleCopy}
                className="absolute top-4 right-4 z-20 p-2 bg-slate-200 dark:bg-[#21262d] rounded-md text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Copy code"
            >
                {copied ? <span className="text-xs font-bold text-green-500">Copied!</span> : <Copy size={16} />}
            </button>

            {/* Code Block */}
            <div className={`relative overflow-hidden transition-all duration-500 ease-in-out ${expanded ? 'max-h-full' : 'max-h-[500px]'}`}>
                {mounted ? (
                    <SyntaxHighlighter
                        language={language}
                        style={resolvedTheme === 'light' ? vs : vscDarkPlus}
                        customStyle={{
                            margin: 0,
                            padding: '1.5rem',
                            fontSize: '13px',
                            lineHeight: '1.5',
                            background: 'transparent', // Let container handle bg
                            textShadow: 'none', // Remove "selected" look
                        }}
                        codeTagProps={{
                            style: {
                                background: 'transparent',
                                textShadow: 'none',
                            }
                        }}
                        showLineNumbers={true}
                        lineNumberStyle={{
                            minWidth: '3em',
                            paddingRight: '1em',
                            color: resolvedTheme === 'light' ? '#94a3b8' : '#6e7681',
                            textAlign: 'right'
                        }}
                    >
                        {code}
                    </SyntaxHighlighter>
                ) : (
                    // Fallback for SSR to prevent hydration mismatch
                    <pre
                        className="m-0 p-6 text-[13px] leading-relaxed overflow-auto bg-transparent font-mono"
                        style={{ color: '#94a3b8' }} // Neutral color
                    >
                        {code}
                    </pre>
                )}

                {/* Gradient Overlay (only if collapsed) */}
                {!expanded && (
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 dark:from-[#0d1117] to-transparent pointer-events-none" />
                )}
            </div>

            {/* Expand/Collapse Control */}
            <div className="relative z-20 bg-slate-100 dark:bg-[#161b22] border-t border-slate-200 dark:border-slate-800 p-2 flex justify-center">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-200 dark:bg-[#21262d] text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-300 dark:hover:bg-[#30363d] transition-colors"
                >
                    {expanded ? (
                        <>
                            <ChevronUp size={14} />
                            Collapse
                        </>
                    ) : (
                        <>
                            <ChevronDown size={14} />
                            Read full source
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
