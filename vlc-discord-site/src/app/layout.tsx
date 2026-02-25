import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vlc-rpc.vercel.app'),
  title: {
    default: "VLC Discord RPC | Native Rich Presence Mod",
    template: "%s | VLC Discord RPC",
  },
  description: "Boost your Discord profile with the ultimate VLC to Discord Rich Presence integration. A lightweight, privacy-focused Windhawk mod to show VLC playback in Discord. No NPM packages or background Node.js scripts needed.",
  keywords: [
    "VLC Discord RPC",
    "VLC Rich Presence",
    "VLC to Discord",
    "Discord Rich Presence for VLC Media Player",
    "Show VLC playback in Discord",
    "Windhawk",
    "Mod",
    "VLC Media Player",
    "Discord Status",
    "Now Playing",
    "Privacy",
    "No Bloatware",
    "Open Source"
  ],
  authors: [{ name: "ciizerr", url: "https://github.com/ciizerr" }],
  creator: "ciizerr",
  openGraph: {
    title: "VLC Discord RPC | Native Rich Presence Mod",
    description: "Boost your Discord profile with the ultimate VLC to Discord Rich Presence integration. A lightweight, privacy-focused Windhawk mod to show VLC playback in Discord. No NPM packages or background Node.js scripts needed.",
    url: 'https://vlc-rpc.vercel.app',
    siteName: 'VLC Discord RPC',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/assets/vlc-discord-icon.png', // We need to make sure this exists or use icon for now
        width: 1200,
        height: 630,
        alt: 'VLC Discord RPC Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "VLC Discord RPC | Native Rich Presence Mod",
    description: "Boost your Discord profile with the ultimate VLC to Discord Rich Presence integration. Lightweight, privacy-focused, no bloatware.",
    images: ['/assets/vlc-discord-icon.png'],
  },
  icons: {
    icon: "/assets/vlc-discord-icon.png",
    shortcut: "/assets/vlc-discord-icon.png",
    apple: "/assets/vlc-discord-icon.png",
  },
  verification: {
    google: "4MbvFMjLTtglVTgNPS1jcYGnG94opIsQVjpRGXFjXFQ",
    other: {
      "msvalidate.01": "018B94031E4FFCDCF660A7D290E5D0F8",
    },
  },
};

import { SettingsProvider } from "@/context/SettingsContext";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "vmpz1tyqw1");
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
