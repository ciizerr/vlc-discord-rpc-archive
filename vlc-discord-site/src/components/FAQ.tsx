"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import React, { useEffect, useRef } from "react";
import { ShieldAlert, Cpu, HelpCircle, AlertTriangle, Settings2, Globe2, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

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

interface FAQItem {
    question: string;
    answer: string;
    value: string;
    icon: React.ReactNode;
    category: string;
}

const faqData: FAQItem[] = [
    {
        category: "Safety & Privacy",
        icon: <ShieldAlert size={18} />,
        question: "Is this safe to use?",
        answer: "Yes. The mod operates strictly within the VLC process and does not interact with other games or software. All data is processed locally on your machine, ensuring zero exposure of your private media habits to external servers.",
        value: "item-1"
    },
    {
        category: "Technical",
        icon: <Cpu size={18} />,
        question: "Why do I need Windhawk? What is it?",
        answer: "Windhawk is essentially the 'marketplace' of Windows customization. It allows us to safely enhance VLC without touching system files, while also enabling you to customize your Start menu, taskbar, and notification center. It ensures zero performance overhead and modular updates.",
        value: "item-2"
    },
    {
        category: "Safety & Privacy",
        icon: <AlertTriangle size={18} />,
        question: "Does this trigger anti-cheat?",
        answer: "No. This mod only injects into the VLC Media Player process. It does not interact with any games or anti-cheat software (like Vanguard or EAC) running on your system, as it never touches those processes.",
        value: "item-3"
    },
    {
        category: "Troubleshooting",
        icon: <Settings2 size={18} />,
        question: "It's not working, what do I do?",
        answer: "Most issues are fixed by ensuring VLC's 'Web Interface' is enabled and Discord's 'Activity Status' is turned ON in your settings. If it's still not showing, check the Windhawk mod logs for specific error messages.",
        value: "item-4"
    },
    {
        category: "Troubleshooting",
        icon: <HelpCircle size={18} />,
        question: "Discord isn't detecting VLC?",
        answer: "Ensure Discord is installed and 'Display Activity' is enabled in User Settings > Activity Privacy. Also, verify that VLC is running and actually playing media—the RPC won't show if media is stopped.",
        value: "item-5"
    },
    {
        category: "Technical",
        icon: <Globe2 size={18} />,
        question: "Does this work on Mac/Linux?",
        answer: "No, Windhawk is currently Windows-only. However, you can check the 'Archive' section for our legacy cross-platform Node.js scripts if you need a solution for macOS or Linux environments.",
        value: "item-6"
    },
    {
        category: "Community",
        icon: <MessageCircle size={18} />,
        question: "Need more help?",
        answer: "If you have specific issues, please open an issue on GitHub or join the Windhawk Discord server. Our community is active and you can tag @ciizerr for direct support regarding this mod.",
        value: "item-7"
    }
];

export default function FAQ() {
    const headerRef = useReveal();
    const contentRef = useReveal();

    return (
        <section
            id="faq"
            className="py-24 md:py-32"
            aria-labelledby="faq-title"
            itemScope
            itemType="https://schema.org/FAQPage"
        >
            <div className="max-w-4xl mx-auto px-6">
                {/* --- Section Header --- */}
                <header ref={headerRef} className="reveal mb-16 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF9500]/10 border border-[#FF9500]/20 text-[#FF9500] text-[11px] font-bold uppercase tracking-wider mb-6">
                        <HelpCircle size={14} />
                        Support Center
                    </div>
                    <h2 id="faq-title" className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
                        Common Questions
                    </h2>
                    <p className="text-[16px] text-[#71717a] max-w-xl mx-auto leading-relaxed">
                        Find answers to technical queries, safety concerns, and setup troubleshooting for the VLC Discord RPC ecosystem.
                    </p>
                </header>

                {/* --- FAQ Matrix --- */}
                <div ref={contentRef} className="reveal space-y-4">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqData.map((item, index) => (
                            <motion.div
                                key={item.value}
                                itemScope
                                itemProp="mainEntity"
                                itemType="https://schema.org/Question"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group"
                            >
                                <AccordionItem
                                    value={item.value}
                                    className="border border-white/[0.06] bg-[#0d0d0f]/50 backdrop-blur-sm rounded-2xl overflow-hidden px-6 transition-all duration-300 hover:border-[#FF9500]/20 hover:bg-[#111113] data-[state=open]:border-[#FF9500]/30 data-[state=open]:bg-[#111113] data-[state=open]:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)]"
                                >
                                    <AccordionTrigger className="text-left py-6 hover:no-underline group">
                                        <div className="flex items-center gap-4 pr-4">
                                            <div className="shrink-0 p-2 rounded-lg bg-white/[0.03] text-[#52525b] group-hover:text-[#FF9500] group-data-[state=open]:text-[#FF9500] group-data-[state=open]:bg-[#FF9500]/10 transition-all duration-300">
                                                {item.icon}
                                            </div>
                                            <div className="space-y-1">
                                                <span className="block text-[10px] font-bold text-[#3f3f46] uppercase tracking-widest group-hover:text-[#FF9500]/60 transition-colors">
                                                    {item.category}
                                                </span>
                                                <span itemProp="name" className="text-[15px] md:text-[17px] font-bold text-white transition-colors">
                                                    {item.question}
                                                </span>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent
                                        className="text-[14px] md:text-[15px] text-[#a1a1aa] leading-relaxed pb-6 pl-12 pr-4"
                                        itemScope
                                        itemProp="acceptedAnswer"
                                        itemType="https://schema.org/Answer"
                                    >
                                        <div itemProp="text" className="border-l-2 border-[#FF9500]/20 pl-6 py-1">
                                            {item.answer}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </motion.div>
                        ))}
                    </Accordion>
                </div>

                {/* --- Footer Hint --- */}
                <div className="mt-16 text-center">
                    <p className="text-[13px] text-[#3f3f46] font-medium">
                        Still have questions? Create an issue on <a href="https://github.com/ciizerr/vlc-discord-rpc-archive/issues" className="text-[#FF9500]/60 hover:text-[#FF9500] transition-colors underline underline-offset-4">GitHub</a>.
                    </p>
                </div>
            </div>
        </section>
    );
}
