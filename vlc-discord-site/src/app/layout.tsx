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
    default: "VLC Discord RPC",
    template: "%s | VLC Discord RPC",
  },
  description: "The native, lightweight bridge between VLC Media Player and your Discord Status.",
  keywords: ["VLC", "Discord", "RPC", "Rich Presence", "Windhawk", "Mod", "VLC Media Player"],
  authors: [{ name: "ciizerr", url: "https://github.com/ciizerr" }],
  creator: "ciizerr",
  openGraph: {
    title: "VLC Discord RPC",
    description: "The native, lightweight bridge between VLC Media Player and your Discord Status.",
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
    title: "VLC Discord RPC",
    description: "The native, lightweight bridge between VLC Media Player and your Discord Status.",
    images: ['/assets/vlc-discord-icon.png'],
  },
  icons: {
    icon: "/assets/vlc-discord-icon.png",
    shortcut: "/assets/vlc-discord-icon.png",
    apple: "/assets/vlc-discord-icon.png",
  },
};

import { SettingsProvider } from "@/context/SettingsContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
