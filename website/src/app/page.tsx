import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-8 pt-32 pb-20">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-orange-500 blur-[80px] opacity-20 rounded-full w-32 h-32 mx-auto"></div>
          <Image
            src="/vlc_logo.png" // Placeholder or we use standard assets later
            width={128}
            height={128}
            alt="VLC Logo"
            className="relative z-10 w-32 h-32"
            unoptimized // Temporarily unoptimized until we have the asset
          />
        </div>

        <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
          VLC Discord Rich Presence
        </h1>

        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
          The ultimate integration for displaying your local media status on Discord.
          Support for Movies, Anime, TV Shows, and customized themes.
        </p>

        <div className="flex gap-4">
          <button className="px-8 py-3 rounded-full bg-orange-600 hover:bg-orange-500 text-white font-semibold transition-all">
            Download Latest
          </button>
          <Link href="/archive" className="px-8 py-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold border border-zinc-700 transition-all flex items-center justify-center">
            View Archive
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-zinc-600 border-t border-zinc-900/50">
        <p>Maintained by ciizerr • Open Source Archive</p>
      </footer>
    </div>
  );
}
