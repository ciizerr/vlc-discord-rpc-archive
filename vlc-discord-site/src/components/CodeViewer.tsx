"use client";

import { useState, useSyncExternalStore as useCommonSyncExternalStore } from "react";

const subscribe = () => () => { };
const getSnapshot = () => true;
const getServerSnapshot = () => false;
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, ChevronDown, ChevronUp, Check } from "lucide-react";

interface CodeViewerProps {
    code: string;
    language: string;
}

export default function CodeViewer({ code, language }: CodeViewerProps) {
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

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
        <div className="relative group border border-white/[0.06] rounded-xl overflow-hidden bg-[#0d0d0f]">
            {/* Copy Button */}
            <button
                onClick={handleCopy}
                className="absolute top-4 right-4 z-20 p-2 bg-[#111113] border border-white/[0.06] rounded-md text-[#a1a1aa] hover:text-white hover:border-[#FF9500]/30 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Copy code"
            >
                {copied ? <Check size={16} className="text-[#FF9500]" /> : <Copy size={16} />}
            </button>

            {/* Code Block */}
            <div className={`relative overflow-hidden transition-all duration-500 ease-in-out ${expanded ? 'max-h-full' : 'max-h-[500px]'}`}>
                {mounted ? (
                    <SyntaxHighlighter
                        language={language}
                        style={vscDarkPlus}
                        customStyle={{
                            margin: 0,
                            padding: '1.5rem',
                            fontSize: '13px',
                            lineHeight: '1.6',
                            background: 'transparent',
                            textShadow: 'none',
                        }}
                        codeTagProps={{
                            style: {
                                background: 'transparent',
                                textShadow: 'none',
                                fontFamily: 'var(--font-inter), monospace',
                            }
                        }}
                        showLineNumbers={true}
                        lineNumberStyle={{
                            minWidth: '3.5em',
                            paddingRight: '1.5em',
                            color: '#3f3f46',
                            textAlign: 'right',
                            userSelect: 'none',
                        }}
                    >
                        {code}
                    </SyntaxHighlighter>
                ) : (
                    <pre
                        className="m-0 p-6 text-[13px] leading-relaxed overflow-auto bg-transparent font-mono text-[#52525b]"
                    >
                        {code}
                    </pre>
                )}

                {/* Gradient Overlay (only if collapsed) */}
                {!expanded && (
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0d0d0f] via-[#0d0d0f]/80 to-transparent pointer-events-none" />
                )}
            </div>

            {/* Expand/Collapse Control */}
            <div className="relative z-20 bg-[#111113] border-t border-white/[0.06] p-2 flex justify-center">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-white/[0.04] text-[#a1a1aa] text-xs font-semibold hover:bg-white/[0.08] hover:text-white transition-all border border-white/[0.06] hover:border-white/[0.1]"
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
