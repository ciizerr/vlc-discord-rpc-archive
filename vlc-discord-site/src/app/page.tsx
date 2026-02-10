import Link from "next/link";
import { Download } from "lucide-react";
import DiscordCardWrapper from "@/components/DiscordCardWrapper";
import RepoExplorer from "@/components/RepoExplorer";
import DotGrid from "@/components/DotGrid";
import Navbar from "@/components/Navigation";
import GlassSurface from "@/components/GlassSurface";
import MagicBento from "@/components/MagicBento";
import ChangelogViewer from "@/components/ChangelogViewer";
import InstallationGuide from "@/components/InstallationGuide";
import FAQ from "@/components/FAQ";
import IconSubmission from "@/components/IconSubmission";
import Footer from "@/components/Footer";
import { getChangelogContent } from "@/lib/source-reader";

export default async function Home() {
  const changelogContent = await getChangelogContent();

  return (
    <div className="min-h-screen text-foreground font-sans selection:bg-orange-500/30 overflow-x-hidden relative">

      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DotGrid
          dotSize={30}
          gap={40}
          proximity={500}
          shockRadius={50}
          shockStrength={10}
          resistance={750}
          returnDuration={2}
        />
      </div>

      <div className="relative z-10">

        {/* --- Floating Navbar --- */}
        <Navbar />

        {/* --- Combined Sections: Hero, Features, Archive --- */}

        {/* --- Section 1: The Hero --- */}
        <section className="relative w-full pt-48 pb-32 text-center">
          {/* Hero Content - Constrained */}
          <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col items-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter drop-shadow-xl text-transparent bg-clip-text bg-gradient-to-r from-[rgba(82,39,255,1)] via-[rgba(255,159,252,1)] to-[rgba(255,149,0,1)]">
              VLC DISCORD RPC
            </h1>

            <p className="text-xl text-muted-foreground mt-6 max-w-2xl mx-auto drop-shadow-md font-medium">
              The native, lightweight bridge between VLC Media Player and your Discord Status.
              Powered by Windhawk.
            </p>

            <div className="mt-12">
              <DiscordCardWrapper />
            </div>

            <div className="mt-10 flex gap-6 justify-center items-center">
              <Link href="https://windhawk.net/mods/vlc-discord-rpc">
                <GlassSurface
                  width="auto"
                  height="auto"
                  borderRadius={99}
                  backgroundOpacity={0.3}
                  brightness={110}
                  opacity={0.5}
                  className="px-8 py-3 text-foreground font-bold hover:brightness-125 transition-all text-sm hover:scale-105 active:scale-95 duration-300"
                >
                  <div className="flex items-center gap-3">
                    <span>Get Mod</span>
                    <Download size={18} strokeWidth={2.5} />
                  </div>
                </GlassSurface>
              </Link>

              <Link href="/archive">
                <GlassSurface
                  width="auto"
                  height="auto"
                  borderRadius={99}

                  backgroundOpacity={0.3}
                  brightness={90}
                  opacity={0.5}
                  mixBlendMode="screen"
                  className="px-8 py-3 text-muted-foreground font-bold border border-white/10 hover:border-white/30 hover:text-foreground transition-all text-sm hover:scale-105 active:scale-95 duration-300"
                >
                  View Source
                </GlassSurface>
              </Link>
            </div>
          </div>
        </section>

        <div className="relative z-10 max-w-6xl mx-auto px-6 pb-24">

          {/* Section 2: Features */}
          <div id="features" className="pt-24 md:pt-32">
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Features</h2>
              <span className="text-slate-500 font-mono text-xs hidden md:block">Why it&apos;s better</span>
            </div>
            <MagicBento
              textAutoHide={false}
              enableStars={true}
              enableTilt
              enableSpotlight={true}
              enableBorderGlow={true}
              glowColor="255, 149, 0"
              cards={[
                {
                  title: "Zero Bloat",
                  description: "Injects directly into the VLC process via Windhawk. No background Node.js scripts eating your RAM.",
                  label: "Performance",
                  color: "#0a0a0a"
                },
                {
                  title: "Local Logic",
                  description: "Runs 100% locally. Your playback data never leaves your machine. No external APIs required.",
                  label: "Privacy",
                  color: "#0a0a0a"
                },
                {
                  title: "Auto-State",
                  description: "Automatically switches between Playing, Paused, and Stopped states instantly using VLC's internal events.",
                  label: "Automation",
                  color: "#0a0a0a"
                },
                {
                  title: "Smart Recognition",
                  description: "Automatically detects SxxExx format to display Show Name, Season, and Episode for TV shows.",
                  label: "Intelligence",
                  color: "#0a0a0a"
                },
                {
                  title: "Instant Search",
                  description: "Includes a configurable 'Search This' button that redirects to Google, IMDb, or YouTube.",
                  label: "Interactive",
                  color: "#0a0a0a"
                },
                {
                  title: "Rich Details",
                  description: "Displays advanced metadata including video resolution (4K/HDR) and active audio languages.",
                  label: "Metadata",
                  color: "#0a0a0a"
                }
              ]}
            />
          </div>


          {/* Section 2.5: Installation Guide */}
          <InstallationGuide />


          {/* Section 3: The Archive */}
          <div className="mt-32">
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Inspect the Source</h2>
              <span className="text-slate-500 font-mono text-xs hidden md:block">vlc-discord-rpc-archive/</span>
            </div>


            <RepoExplorer />
          </div>

          {/* Section 4: Changelog */}
          <div id="changelog" className="mt-32">
            {changelogContent && <ChangelogViewer markdown={changelogContent} />}
          </div>

          {/* Section 4.5: Icon Submission */}
          <IconSubmission />

          {/* Section 5: FAQ */}
          <FAQ />

        </div>

        {/* --- Footer --- */}
        <Footer />

      </div>
    </div>
  );
}
