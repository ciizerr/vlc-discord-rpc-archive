"use client";

import React from "react";
import PixelBlast from "@/components/PixelBlast";

export default function DynamicBackground() {
    const [opacity, setOpacity] = React.useState(1);

    React.useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            // Fade out completely by 600px
            const newOpacity = Math.max(0, 1 - scrollY / 600);
            setOpacity(newOpacity);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className="fixed inset-0 z-0 transition-opacity duration-75 ease-out"
            style={{ opacity: opacity }}
        >
            <PixelBlast variant="square"
                pixelSize={4}
                color="#ffbb00"
                patternScale={2}
                patternDensity={1}
                pixelSizeJitter={0}
                enableRipples
                rippleSpeed={0.4}
                rippleThickness={0.12}
                rippleIntensityScale={1.5}
                liquid={false}
                liquidStrength={0.12}
                liquidRadius={1.2}
                liquidWobbleSpeed={5}
                speed={0.5}
                edgeFade={0.25}
                transparent
            />
        </div>
    );
}
