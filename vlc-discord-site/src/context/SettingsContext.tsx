"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

interface SettingsContextType {
    glassBlurLevel: number;
    setGlassBlurLevel: (level: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [glassBlurLevel, setGlassBlurLevel] = useState(12);

    return (
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
            <SettingsContext.Provider value={{ glassBlurLevel, setGlassBlurLevel }}>
                {children}
            </SettingsContext.Provider>
        </NextThemesProvider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
