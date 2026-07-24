import { getShowDetails } from "@/lib/api";
import MediaHero from "@/components/MediaHero";
import MediaOverviewAndStats from "@/components/MediaOverviewAndStats";
import MediaSeasons from "@/components/MediaSeasons";
import MediaGallery from "@/components/MediaGallery";
import CastList from "@/components/CastList";
import MediaDiscoveryCarousel from "@/components/MediaDiscoveryCarousel";
import MediaNavigation from "@/components/MediaNavigation";
import MediaFooter from "@/components/MediaFooter";
import MediaFallbackCard from "@/components/MediaFallbackCard";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ source: string; id: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params;
    const source = params.source as 'tmdb' | 'tvmaze';
    if (source !== 'tmdb' && source !== 'tvmaze') return { title: "Show Details" };
    
    const media = await getShowDetails(params.id, source);
    return {
      title: media.title,
      description: media.overview,
    };
  } catch {
    return {
      title: "Show Details | VLC Discord RPC",
    };
  }
}

export default async function ShowPage(props: Props) {
  const params = await props.params;
  const source = params.source as 'tmdb' | 'tvmaze';
  
  if (source !== 'tmdb' && source !== 'tvmaze') {
    notFound();
  }

  let media;
  try {
    media = await getShowDetails(params.id, source);
  } catch (error) {
    console.error("Show fetch error:", error);

    // TVMaze errors trigger standard 404
    if (source === 'tvmaze') {
      notFound();
    }

    // TMDb errors render MediaFallbackCard
    const isInvalidKey = error instanceof Error && (error.message.includes('INVALID_TMDB_KEY') || error.message.includes('401'));
    const isRateLimited = error instanceof Error && (error.message.includes('RATE_LIMITED') || error.message.includes('429'));
    
    return (
      <main className="min-h-screen bg-black text-white flex flex-col relative z-0 selection:bg-amber-500/30 selection:text-amber-200">
        <MediaNavigation title="Show Search" mediaType="show" />
        <MediaFallbackCard 
          type="tmdb_show_missing" 
          errorDetail={isInvalidKey ? 'invalid_api_key' : isRateLimited ? 'rate_limited' : undefined} 
        />
        <MediaFooter />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col relative z-0 selection:bg-amber-500/30 selection:text-amber-200">
      <MediaNavigation title={media.title} mediaType="show" />
      <MediaHero media={media} />
      <MediaOverviewAndStats media={media} />

      {/* Clean Seasons Section */}
      <MediaSeasons showId={params.id} source={source} seasons={media.seasons} />

      <MediaGallery backdrops={media.backdrops} />
      <CastList cast={media.cast} directors={media.directors} source={source} />
      <MediaDiscoveryCarousel 
        recommendations={media.recommendations} 
        currentMedia={{
          id: media.id,
          title: media.title,
          posterPath: media.posterPath,
          releaseYear: media.releaseYear,
          mediaType: "show",
          source
        }} 
      />
      <MediaFooter />
    </main>
  );
}
