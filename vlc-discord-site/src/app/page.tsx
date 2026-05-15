import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DiscordCardWrapper from "@/components/DiscordCardWrapper";
import RepoExplorer from "@/components/RepoExplorer";
import Navbar from "@/components/Navigation";
import FeatureSection from "@/components/FeatureSection";
import ChangelogViewer from "@/components/ChangelogViewer";
import InstallationGuide from "@/components/InstallationGuide";
import FAQ from "@/components/FAQ";
import IconSubmission from "@/components/IconSubmission";
import Footer from "@/components/Footer";
import { getChangelogContent } from "@/lib/source-reader";
import LogoLoop from "@/components/LogoLoop";

export default async function Home() {
  const changelogContent = await getChangelogContent();

  return (
    <main className="min-h-screen text-white font-sans overflow-x-hidden relative">

      {/* --- Floating Navbar --- */}
      <Navbar />

      {/* ═══════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════ */}
      <section className="relative w-full pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background Gradient Mesh */}
        <div className="hero-mesh" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-16 md:gap-12">

            {/* Left: Text Content */}
            <div className="flex-1 text-center md:text-left max-w-xl">
              {/* Eyebrow */}
              <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF9500] mb-5 animate-fade-up">
                Windhawk Mod
              </span>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] leading-[1.1] text-white mb-6 animate-fade-up stagger-1">
                Show what you&apos;re<br className="hidden md:block" /> watching.
              </h1>

              {/* Subtitle */}
              <p className="text-[16px] md:text-[17px] leading-relaxed text-[#a1a1aa] mb-10 max-w-md mx-auto md:mx-0 animate-fade-up stagger-2">
                A native, zero-bloat bridge between VLC Media Player and Discord Rich Presence. No scripts. No overhead. Just works.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start animate-fade-up stagger-3">
                <Link
                  href="https://windhawk.net/mods/vlc-discord-rpc"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF9500] hover:bg-[#e68600] text-[#09090b] text-[14px] font-semibold rounded-md transition-all duration-200 hover:shadow-[0_0_30px_rgba(255,149,0,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  Download via Windhawk
                  <ArrowRight size={16} strokeWidth={2.5} />
                </Link>
                <Link
                  href="/archive"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border border-white/[0.1] text-white text-[14px] font-medium rounded-md transition-all duration-200 hover:bg-white/[0.04] hover:border-white/[0.15]"
                >
                  View Source
                </Link>
              </div>
            </div>

            {/* Right: Discord Card */}
            <div className="flex-shrink-0 animate-fade-up stagger-3">
              <div className="relative">
                {/* Glow behind card */}
                <div className="absolute inset-0 bg-[#FF9500]/[0.06] blur-3xl rounded-3xl scale-110 animate-float pointer-events-none" />
                <DiscordCardWrapper />
              </div>
            </div>
          </div>

          {/* Works With Strip */}
          <div className="mt-24 md:mt-32 flex flex-col items-center gap-8 animate-fade-up stagger-5 w-full">
            <span className="text-[12px] uppercase tracking-[0.25em] text-[#3f3f46] font-bold">
              Works with
            </span>

            <LogoLoop
              logos={[
                { src: "/vlc_logo.png", alt: "VLC Media Player" },
                { src: "/assets/discord.svg", alt: "Discord" },
                { src: "/assets/windhawk.svg", alt: "Windhawk" },
              ]}
              direction="right"
              speed={100}
              gap={190}
              hoverSpeed={50}
              logoHeight={50}
              scaleOnHover={true}
              grayscale={true}
              fadeOut={true}
              fadeOutColor="#09090b"
              className="max-w-4xl"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          MAIN CONTENT SECTIONS
          ═══════════════════════════════════════ */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-24">

        {/* Divider */}
        <div className="section-divider" />

        {/* Features */}
        <FeatureSection />

        {/* Divider */}
        <div className="section-divider" />

        {/* Installation */}
        <InstallationGuide />

        {/* Divider */}
        <div className="section-divider" />

        {/* Source Code */}
        <div className="py-24 md:py-32">
          <div className="mb-12">
            <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#FF9500] mb-3">
              Open Source
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
              Inspect the Source
            </h2>
            <p className="text-[14px] text-[#71717a]">
              Every line of code is public. Read it, audit it, improve it.
            </p>
          </div>
          <RepoExplorer />
        </div>

        {/* Divider */}
        <div className="section-divider" />

        {/* Changelog */}
        <div id="changelog" className="py-24 md:py-32">
          {changelogContent && <ChangelogViewer markdown={changelogContent} />}
        </div>

        {/* Icon Submission */}
        <IconSubmission />

        {/* Divider */}
        <div className="section-divider" />

        {/* FAQ */}
        <FAQ />

      </div>

      {/* --- Footer --- */}
      <Footer />

    </main>
  );
}
