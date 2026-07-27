import { getMovieDetails } from "@/lib/api";
import MediaHero from "@/components/MediaHero";
import MediaOverviewAndStats from "@/components/MediaOverviewAndStats";
import MediaGallery from "@/components/MediaGallery";
import CastList from "@/components/CastList";
import MediaDiscoveryCarousel from "@/components/MediaDiscoveryCarousel";
import MediaNavigation from "@/components/MediaNavigation";
import MediaFooter from "@/components/MediaFooter";
import MediaFallbackCard from "@/components/MediaFallbackCard";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params;
    const media = await getMovieDetails(params.id);
    const ogUrl = `/api/og?type=movie&id=${params.id}`;
    return {
      title: media.title,
      description: media.overview,
      openGraph: {
        title: media.title,
        description: media.overview,
        images: [{ url: ogUrl, width: 1200, height: 630, alt: media.title }],
      },
      twitter: {
        card: "summary_large_image",
        title: media.title,
        description: media.overview,
        images: [ogUrl],
      },
    };
  } catch {
    return {
      title: "Movie Details | VLC Discord RPC",
    };
  }
}

export default async function MoviePage(props: Props) {
  const params = await props.params;

  let media;
  try {
    media = await getMovieDetails(params.id);
  } catch (error) {
    console.error("Movie fetch error:", error);
    const isInvalidKey = error instanceof Error && (error.message.includes('INVALID_TMDB_KEY') || error.message.includes('401'));
    const isRateLimited = error instanceof Error && (error.message.includes('RATE_LIMITED') || error.message.includes('429'));

    return (
      <main className="min-h-screen bg-black text-white flex flex-col relative z-0 selection:bg-amber-500/30 selection:text-amber-200">
        <MediaNavigation title="Movie Notice" mediaType="movie" />
        <MediaFallbackCard 
          type="movie_traffic" 
          errorDetail={isInvalidKey ? 'invalid_api_key' : isRateLimited ? 'rate_limited' : 'heavy_traffic'} 
        />
        <MediaFooter />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col relative z-0 selection:bg-amber-500/30 selection:text-amber-200">
      <MediaNavigation title={media.title} mediaType="movie" />
      <MediaHero media={media} />
      <MediaOverviewAndStats media={media} />
      <MediaGallery backdrops={media.backdrops} />
      <CastList cast={media.cast} directors={media.directors} />
      <MediaDiscoveryCarousel 
        recommendations={media.recommendations} 
        currentMedia={{
          id: media.id,
          title: media.title,
          posterPath: media.posterPath,
          releaseYear: media.releaseYear,
          mediaType: "movie",
          source: "tmdb"
        }} 
      />
      <MediaFooter />
    </main>
  );
}
