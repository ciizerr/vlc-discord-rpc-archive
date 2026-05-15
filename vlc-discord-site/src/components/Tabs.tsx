"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Tab {
    id: string;
    label: string;
    content: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    defaultTab?: string;
}

export default function Tabs({ tabs, defaultTab }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

    return (
        <div className="w-full">
            {/* Tab Headers */}
            <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-white/[0.06] pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative px-4 py-2 text-[13px] font-semibold transition-all rounded-md overflow-hidden group ${activeTab === tab.id
                                ? "text-[#FF9500] bg-[#FF9500]/10"
                                : "text-[#a1a1aa] hover:text-white hover:bg-white/[0.04]"
                            }`}
                    >
                        <span className="relative z-10">{tab.label}</span>
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTabIndicator"
                                className="absolute inset-x-0 bottom-0 h-[2px] bg-[#FF9500]"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="relative min-h-[400px]">
                <AnimatePresence mode="wait">
                    {tabs.map((tab) => (
                        activeTab === tab.id && (
                            <motion.div
                                key={tab.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="w-full animate-fade-in"
                            >
                                {tab.content}
                            </motion.div>
                        )
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
