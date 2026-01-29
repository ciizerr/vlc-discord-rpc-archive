import Link from "next/link";
import DecryptedText from "@/components/DecryptedText";
import DiscordCard from "@/components/DiscordCard";
import RepoExplorer from "@/components/RepoExplorer";
import DynamicBackground from "@/components/DynamicBackground";

export default function Home() {
  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-orange-500/30 overflow-x-hidden">

      {/* --- Fixed Full Screen Background --- */}
      <DynamicBackground />

      {/* --- Section 1: The Hero --- */}
      <section className="relative w-full pt-48 pb-32 text-center pointer-events-none">

        {/* Hero Content - Constrained */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col items-center pointer-events-auto">
          <DecryptedText
            text="VLC DISCORD RPC"
            speed={100}
            className="text-5xl md:text-7xl font-bold text-white tracking-tighter drop-shadow-xl"
          />

          <p className="text-xl text-slate-200 mt-6 max-w-2xl mx-auto drop-shadow-md font-medium">
            The native, lightweight bridge between VLC Media Player and your Discord Status.
            Powered by Windhawk.
          </p>

          <div className="relative mt-12 group inline-block transition-all duration-300 ease-out hover:scale-115 hover:-translate-y-1">
            <DiscordCard />
          </div>

          <div className="mt-10 flex gap-4 justify-center">
            <Link href="https://windhawk.net/mods/vlc-discord-rpc" className="bg-white text-slate-950 px-8 py-3 rounded-full font-bold hover:bg-slate-200 transition-colors">
              Windhawk Mod Store
            </Link>
            <Link href="/archive" className="px-8 py-3 rounded-full border border-slate-700 hover:border-slate-500 hover:bg-slate-900 transition-colors bg-slate-950/50 backdrop-blur-sm">
              View Source
            </Link>
          </div>
        </div>
      </section>

      {/* --- Main Content (Constrained) --- */}
      <div className="max-w-6xl mx-auto px-6">

        {/* --- Section 2: Why This Mod? --- */}
        <section className="mt-24">
          <h2 className="sr-only">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 border border-slate-800 rounded-xl bg-slate-900/50 hover:border-orange-500/50 transition-colors group">
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500/10 transition-colors">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Zero Bloat</h3>
              <p className="text-slate-400 leading-relaxed">
                Injects directly into the VLC process via Windhawk. No background Node.js scripts eating your RAM.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 border border-slate-800 rounded-xl bg-slate-900/50 hover:border-orange-500/50 transition-colors group">
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500/10 transition-colors">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Local Logic</h3>
              <p className="text-slate-400 leading-relaxed">
                Runs 100% locally. Your playback data never leaves your machine. No external APIs required.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 border border-slate-800 rounded-xl bg-slate-900/50 hover:border-orange-500/50 transition-colors group">
              <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500/10 transition-colors">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Auto-State</h3>
              <p className="text-slate-400 leading-relaxed">
                Automatically switches between Playing, Paused, and Stopped states instantly using VLC&apos;s internal events.
              </p>
            </div>
          </div>
        </section>


        {/* --- Section 3: The Archive --- */}
        <section className="mt-32">
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Inspect the Source</h2>
            <span className="text-slate-500 font-mono text-xs hidden md:block">vlc-discord-rpc-archive/</span>
          </div>

          <RepoExplorer />
        </section>


        {/* --- Section 4: Community --- */}
        <section className="mt-32 mb-20 p-12 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-3">Submit Your Designs</h2>
              <p className="text-slate-400 max-w-lg">
                We are expanding themes. Submit your custom icon packs (Anime, Minimal, Retro) to show your work.
              </p>
            </div>
            <Link href="https://github.com/ciizerr/vlc-discord-rpc-archive/pulls" className="bg-white text-slate-950 px-6 py-3 rounded-lg font-bold hover:bg-slate-200 transition-colors whitespace-nowrap">
              Submit PR
            </Link>
          </div>
        </section>

        {/* --- Footer --- */}
        <footer className="py-10 border-t border-slate-900/50 flex flex-col md:flex-row justify-between items-center text-slate-600 text-sm">
          <p>Maintained by ciizerr. Open Source under MIT License.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="https://github.com/ciizerr/vlc-discord-rpc-archive" className="hover:text-slate-400 transition-colors">GitHub</Link>
            <Link href="https://windhawk.net" className="hover:text-slate-400 transition-colors">Windhawk Store</Link>
          </div>
        </footer>

      </div>
    </div>
  );
}
