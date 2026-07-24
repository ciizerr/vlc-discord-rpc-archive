import HeroSection from "@/components/HeroSection";
import RepoExplorer from "@/components/RepoExplorer";
import Navbar from "@/components/Navigation";
import FeatureSection from "@/components/FeatureSection";
import SettingsShowcase from "@/components/SettingsShowcase";
import ChangelogViewer from "@/components/ChangelogViewer";
import InstallationGuide from "@/components/InstallationGuide";
import FAQ from "@/components/FAQ";
import IconSubmission from "@/components/IconSubmission";
import Footer from "@/components/Footer";
import { getChangelogContent } from "@/lib/source-reader";
import LogoLoop from "@/components/LogoLoop";
import MediaDiscoveryCarousel from "@/components/MediaDiscoveryCarousel";

export default async function Home() {
  const changelogContent = await getChangelogContent();

  return (
    <main className="min-h-screen text-white font-sans overflow-x-hidden relative">

      {/* --- Floating Navbar --- */}
      <Navbar />

      <HeroSection />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="mt-12 mb-24 flex flex-col items-center gap-8 animate-fade-up stagger-5 w-full">
          <span className="text-[12px] uppercase tracking-[0.25em] text-[#3f3f46] font-bold">
            Works with
          </span>

          <LogoLoop
            logos={[
              { src: "/assets/vlc_media_player.png", alt: "VLC Media Player" },
              { src: "/assets/discord.svg", alt: "Discord" },
              { src: "/assets/windhawk.svg", alt: "Windhawk" },
              { src: "/assets/Windows.svg", alt: "Windows" },

            ]}
            direction="right"
            speed={90}
            gap={190}
            hoverSpeed={50}
            logoHeight={50}
            scaleOnHover={true}
            grayscale={true}
          />
        </div>
      </div>

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

        {/* Interactive Showcase */}
        <SettingsShowcase />
      </div>

      {/* Recently Viewed (Full Width) */}
      <div className="relative z-10 w-full">
        <MediaDiscoveryCarousel />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-24">

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
