"use client";

import { useEffect, useState, useRef } from "react";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789;<>?[]{}!@#$%^&*()";

interface DecryptedTextProps {
    text: string;
    speed?: number;
    className?: string;
}

export default function DecryptedText({ text, speed = 50, className = "" }: DecryptedTextProps) {
    const [displayText, setDisplayText] = useState(text.split("").map(() => " "));
    const iteration = useRef(0);
    const interval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Reset
        iteration.current = 0;

        interval.current = setInterval(() => {
            setDisplayText((prev) =>
                text.split("").map((letter, index) => {
                    if (index < iteration.current) {
                        return text[index];
                    }
                    return letters[Math.floor(Math.random() * letters.length)];
                })
            );

            if (iteration.current >= text.length) {
                if (interval.current) clearInterval(interval.current);
            }

            iteration.current += 1 / 3; // Slow down the reveal
        }, speed);

        return () => {
            if (interval.current) clearInterval(interval.current);
        };
    }, [text, speed]);

    return <span className={className}>{displayText.join("")}</span>;
}
