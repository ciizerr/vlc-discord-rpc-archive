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

    // Premium coding font stack
    const codingFont = "'Google Sans Code', 'JetBrains Mono', 'Roboto Mono', 'Fira Code', monospace";

    return (
        <div className="relative group flex flex-col h-full bg-[#0d0d0f]">
            {/* Copy Button */}
            <button
                onClick={handleCopy}
                className="absolute top-4 right-6 z-30 p-2.5 bg-[#111113]/80 backdrop-blur-md border border-white/[0.08] rounded-lg text-[#a1a1aa] hover:text-white hover:border-[#FF9500]/40 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 shadow-2xl"
                title="Copy code"
            >
                {copied ? <Check size={16} className="text-[#FF9500]" /> : <Copy size={16} />}
            </button>

            {/* Code Block Container */}
            <div className={`relative flex-1 overflow-hidden transition-all duration-700 ease-in-out ${expanded ? 'max-h-full' : 'max-h-[600px]'}`}>
                {mounted ? (
                    <SyntaxHighlighter
                        language={language}
                        style={vscDarkPlus}
                        customStyle={{
                            margin: 0,
                            padding: '2rem 1rem',
                            fontSize: '13px',
                            lineHeight: '1.7',
                            background: 'transparent',
                            textShadow: 'none',
                        }}
                        codeTagProps={{
                            style: {
                                background: 'transparent',
                                textShadow: 'none',
                                fontFamily: codingFont,
                                fontWeight: 500,
                            }
                        }}
                        showLineNumbers={true}
                        lineNumberStyle={{
                            minWidth: '4em',
                            paddingRight: '2em',
                            color: '#3f3f46',
                            textAlign: 'right',
                            userSelect: 'none',
                            fontFamily: codingFont,
                            fontSize: '12px',
                        }}
                    >
                        {code}
                    </SyntaxHighlighter>
                ) : (
                    <pre
                        style={{ fontFamily: codingFont }}
                        className="m-0 p-8 text-[13px] leading-relaxed overflow-auto bg-transparent text-[#52525b]"
                    >
                        {code}
                    </pre>
                )}

                {/* Ambient Glow for Code */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-[#FF9500]/[0.02] blur-[100px] pointer-events-none" />

                {/* Fade-out Gradient (only if collapsed) */}
                {!expanded && (
                    <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0d0d0f] via-[#0d0d0f]/90 to-transparent z-10 pointer-events-none" />
                )}
            </div>

            {/* Expand/Collapse Control - Floating Style */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-[#111113] border border-white/[0.08] text-[#a1a1aa] text-[13px] font-bold hover:bg-[#18181b] hover:text-white hover:border-[#FF9500]/40 transition-all shadow-[0_12px_24px_rgba(0,0,0,0.4)] hover:shadow-[#FF9500]/5 group/btn"
                >
                    {expanded ? (
                        <>
                            <ChevronUp size={16} className="group-hover/btn:-translate-y-0.5 transition-transform" />
                            Collapse Source
                        </>
                    ) : (
                        <>
                            <ChevronDown size={16} className="group-hover/btn:translate-y-0.5 transition-transform" />
                            Explore Full Source
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
