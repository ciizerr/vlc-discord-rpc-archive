"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import React, { useEffect, useRef } from "react";

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

export default function FAQ() {
    const headerRef = useReveal();
    const contentRef = useReveal();

    const items = [
        {
            question: "Is this safe to use?",
            answer: "Yes. The mod operates strictly within the VLC process and does not interact with other games or software. All data is processed locally on your machine.",
            value: "item-1"
        },
        {
            question: "Why do I need Windhawk?",
            answer: "Windhawk allows us to inject code into VLC safely without modifying system files directly. It ensures modularity, easy updates, and zero performance overhead compared to external scripts.",
            value: "item-2"
        },
        {
            question: "Does this trigger anti-cheat?",
            answer: "No. This mod only injects into the VLC Media Player process. It does not interact with any games or anti-cheat software running on your system.",
            value: "item-3"
        },
        {
            question: "It's not working, what do I do?",
            answer: "Check the Windhawk mod logs first to identify the issue. Common fixes include: 1. Ensure VLC's Web Interface is enabled with password '1234'. 2. Verify Discord's 'Activity Status' is ON. 3. If you see '401 Unauthorized' in logs, your VLC password is wrong. 4. If connection fails, manually set 'http-port=8080' in your %APPDATA%\\vlc\\vlcrc file.",
            value: "item-4"
        },
        {
            question: "Discord isn't detecting VLC?",
            answer: "Ensure Discord is installed and 'Display Activity' is enabled in User Settings > Activity Privacy. Also, verify that VLC is running and playing media.",
            value: "item-5"
        },
        {
            question: "Does this work on Mac/Linux?",
            answer: "No, Windhawk is Windows-only. Check the 'Archive' section for our cross-platform scripts (Node.js) if you are on macOS or Linux.",
            value: "item-6"
        },
        {
            question: "Need more help?",
            answer: "If you have other questions, feel free to open an issue on GitHub or reach out to the Windhawk community on Discord and tag @ciizerr.",
            value: "item-7"
        }
    ];

    return (
        <section id="faq" className="py-24 md:py-32 max-w-2xl mx-auto">
            {/* Section Header */}
            <div ref={headerRef} className="reveal mb-12">
                <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#FF9500] mb-3">
                    Support
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
                    Frequently Asked Questions
                </h2>
                <p className="text-[14px] text-[#71717a]">
                    Everything you need to know about the mod.
                </p>
            </div>

            {/* Accordion */}
            <div ref={contentRef} className="reveal" style={{ transitionDelay: "0.1s" }}>
                <Accordion type="single" collapsible className="w-full">
                    {items.map((item) => (
                        <AccordionItem
                            key={item.value}
                            value={item.value}
                            className="border-b border-white/[0.06] last:border-0"
                        >
                            <AccordionTrigger className="text-left text-[15px] font-medium text-[#fafafa] hover:no-underline hover:text-[#FF9500] transition-colors py-5">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-[14px] text-[#a1a1aa] leading-relaxed pb-5">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
