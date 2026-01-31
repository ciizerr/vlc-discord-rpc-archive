"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
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
            answer: "First, ensure Discord is installed and running with 'Display Activity' enabled (User Settings > Activity Privacy). If the issue persists, try restarting VLC, Discord, or your PC. If it still doesn't work, check the Windhawk logs and open an issue on GitHub.",
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
            answer: "If you have other questions, feel free to open an issue on GitHub or reach out to the community on Discord.",
            value: "item-7"
        }
    ];

    return (
        <section id="faq" className="py-24 max-w-3xl mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                    Frequently Asked Questions
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                    Everything you need to know about the mod.
                </p>
            </div>

            <div className="bg-gradient-to-br from-orange-500/10 to-purple-600/10 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-lg">
                <Accordion type="single" collapsible className="w-full">
                    {items.map((item) => (
                        <AccordionItem key={item.value} value={item.value} className="border-b-slate-200 dark:border-b-slate-800 last:border-0">
                            <AccordionTrigger className="text-left text-slate-900 dark:text-slate-100 hover:no-underline hover:text-orange-500 dark:hover:text-orange-400 transition-colors py-4">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed pb-4">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
