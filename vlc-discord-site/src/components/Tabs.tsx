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
            <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-slate-200 dark:border-white/10 pb-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-lg overflow-hidden group ${activeTab === tab.id
                                ? "text-orange-500 bg-orange-500/10"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                            }`}
                    >
                        <span className="relative z-10">{tab.label}</span>
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTabIndicator"
                                className="absolute inset-x-0 bottom-0 h-0.5 bg-orange-500"
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
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="w-full"
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
