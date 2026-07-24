import { getShowDetails, getSeasonEpisodes } from "@/lib/api";
import MediaEpisodes from "@/components/MediaEpisodes";
import MediaNavigation from "@/components/MediaNavigation";
import MediaFooter from "@/components/MediaFooter";
import MediaFallbackCard from "@/components/MediaFallbackCard";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Layers, Calendar, Tv } from "lucide-react";

type Props = {
  params: Promise<{ source: string; id: string; season: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params;
    const source = params.source as 'tmdb' | 'tvmaze';
    const seasonNumber = parseInt(params.season, 10);
    
    if ((source !== 'tmdb' && source !== 'tvmaze') || isNaN(seasonNumber)) {
      return { title: "Season Details" };
    }
    
    const media = await getShowDetails(params.id, source);
    return {
      title: `${media.title} - Season ${seasonNumber}`,
      description: `Explore all episodes for Season ${seasonNumber} of ${media.title}.`,
    };
  } catch {
    return {
      title: "Season Details | VLC Discord RPC",
    };
  }
}

export default async function SeasonPage(props: Props) {
  const params = await props.params;
  const source = params.source as 'tmdb' | 'tvmaze';
  const seasonNumber = parseInt(params.season, 10);

  if ((source !== 'tmdb' && source !== 'tvmaze') || isNaN(seasonNumber)) {
    notFound();
  }

  let media;
  let episodes = [];
  try {
    const [mediaRes, epRes] = await Promise.all([
      getShowDetails(params.id, source),
      getSeasonEpisodes(source, params.id, seasonNumber),
    ]);
    media = mediaRes;
    episodes = epRes;
  } catch (error) {
    console.error("Season fetch error:", error);

    // TVMaze errors trigger standard 404
    if (source === 'tvmaze') {
      notFound();
    }

    // TMDb errors render MediaFallbackCard
    const isInvalidKey = error instanceof Error && (error.message.includes('INVALID_TMDB_KEY') || error.message.includes('401'));
    const isRateLimited = error instanceof Error && (error.message.includes('RATE_LIMITED') || error.message.includes('429'));
    return (
      <main className="min-h-screen bg-black text-white flex flex-col relative z-0 selection:bg-amber-500/30 selection:text-amber-200">
        <MediaNavigation title="Season Search" mediaType="show" />
        <MediaFallbackCard 
          type="tmdb_show_missing" 
          errorDetail={isInvalidKey ? 'invalid_api_key' : isRateLimited ? 'rate_limited' : undefined} 
        />
        <MediaFooter />
      </main>
    );
  }

  const currentSeasonInfo = media.seasons.find(
    s => (s.seasonNumber ?? 1) === seasonNumber
  ) || media.seasons[0];

  const showUrl = `/show/${source}/${params.id}`;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col relative z-0 selection:bg-amber-500/30 selection:text-amber-200">
      <MediaNavigation
        title={`${media.title} - Season ${seasonNumber}`}
        mediaType="show"
        backHref={showUrl}
        backLabel={media.title}
      />

      {/* Season Hero Section */}
      <div className="relative w-full overflow-hidden pb-8">
        <div className="relative w-full h-[50vh] md:h-[60vh] bg-black overflow-hidden">
          {media.backdropPath && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 blur-md scale-105"
              style={{ backgroundImage: `url(${media.backdropPath})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        </div>

        {/* Foreground Card */}
        <div className="container mx-auto px-4 md:px-8 relative z-10 -mt-36 md:-mt-48">

          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
            {/* Season Poster Cover */}
            <div className="w-40 md:w-56 shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/15 relative aspect-[2/3] bg-zinc-900 group">
              {currentSeasonInfo?.posterPath || media.posterPath ? (
                <Image
                  src={currentSeasonInfo?.posterPath || media.posterPath || ""}
                  alt={currentSeasonInfo?.name || `Season ${seasonNumber}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 160px, 224px"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                  <Tv size={48} />
                </div>
              )}
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
            </div>

            {/* Season Header Details */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-black text-xs font-black tracking-wider uppercase flex items-center gap-1.5">
                  <Layers size={13} />
                  Season {seasonNumber}
                </span>
                {currentSeasonInfo?.episodeCount ? (
                  <span className="px-3 py-1 rounded-full bg-black/60 border border-white/10 text-xs font-bold text-zinc-300">
                    {currentSeasonInfo.episodeCount} Episodes
                  </span>
                ) : null}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
                {currentSeasonInfo?.name || `Season ${seasonNumber}`}
              </h1>

              <div className="flex items-center gap-3 text-xs font-semibold text-zinc-400 mb-4">
                <span className="text-zinc-300 font-bold text-sm">{media.title}</span>
                {currentSeasonInfo?.airDate && (
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-amber-400" />
                    Premiered {currentSeasonInfo.airDate}
                  </span>
                )}
              </div>

              <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-normal max-w-3xl">
                {media.overview}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Season Episode Grid */}
      <MediaEpisodes
        showId={params.id}
        source={source}
        seasons={media.seasons}
        seasonNumber={seasonNumber}
        initialEpisodes={episodes}
        hideSeasonTabs={true}
      />

      <MediaFooter />
    </main>
  );
}
