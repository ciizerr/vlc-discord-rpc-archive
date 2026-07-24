import { getEpisodeDetails, getSeasonEpisodes } from "@/lib/api";
import MediaEpisodes from "@/components/MediaEpisodes";
import CastList from "@/components/CastList";
import MediaNavigation from "@/components/MediaNavigation";
import MediaFooter from "@/components/MediaFooter";
import MediaFallbackCard from "@/components/MediaFallbackCard";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Calendar, Clock, Star } from "lucide-react";

type Props = {
  params: Promise<{ source: string; id: string; season: string; episode: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params;
    const source = params.source as 'tmdb' | 'tvmaze';
    const seasonNumber = parseInt(params.season, 10);
    const episodeNumber = parseInt(params.episode, 10);
    
    if ((source !== 'tmdb' && source !== 'tvmaze') || isNaN(seasonNumber) || isNaN(episodeNumber)) {
      return { title: "Episode Details" };
    }
    
    const ep = await getEpisodeDetails(source, params.id, seasonNumber, episodeNumber);
    return {
      title: `${ep.showTitle} S${seasonNumber}E${episodeNumber} - ${ep.title}`,
      description: ep.overview,
    };
  } catch {
    return {
      title: "Episode Details | VLC Discord RPC",
    };
  }
}

export default async function EpisodePage(props: Props) {
  const params = await props.params;
  const source = params.source as 'tmdb' | 'tvmaze';
  const seasonNumber = parseInt(params.season, 10);
  const episodeNumber = parseInt(params.episode, 10);

  if ((source !== 'tmdb' && source !== 'tvmaze') || isNaN(seasonNumber) || isNaN(episodeNumber)) {
    notFound();
  }

  let ep;
  let seasonEpisodes = [];
  try {
    const [epRes, seasonEpRes] = await Promise.all([
      getEpisodeDetails(source, params.id, seasonNumber, episodeNumber),
      getSeasonEpisodes(source, params.id, seasonNumber),
    ]);
    ep = epRes;
    seasonEpisodes = seasonEpRes;
  } catch (error) {
    console.error("Episode fetch error:", error);

    // TVMaze errors trigger standard 404
    if (source === 'tvmaze') {
      notFound();
    }

    // TMDb errors render MediaFallbackCard
    const isInvalidKey = error instanceof Error && (error.message.includes('INVALID_TMDB_KEY') || error.message.includes('401'));
    const isRateLimited = error instanceof Error && (error.message.includes('RATE_LIMITED') || error.message.includes('429'));
    return (
      <main className="min-h-screen bg-black text-white flex flex-col relative z-0 selection:bg-amber-500/30 selection:text-amber-200">
        <MediaNavigation title="Episode Notice" mediaType="show" />
        <MediaFallbackCard 
          type="episode_missing" 
          errorDetail={isInvalidKey ? 'invalid_api_key' : isRateLimited ? 'rate_limited' : undefined} 
        />
        <MediaFooter />
      </main>
    );
  }

  const showUrl = `/show/${source}/${params.id}`;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col relative z-0 selection:bg-amber-500/30 selection:text-amber-200">
      <MediaNavigation
        title={`${ep.showTitle} - S${ep.seasonNumber}E${ep.episodeNumber}`}
        mediaType="show"
        backHref={showUrl}
        backLabel={ep.showTitle}
      />

      {/* Hero Banner for Episode */}
      <div className="relative w-full overflow-hidden pb-8">
        <div className="relative w-full h-[50vh] md:h-[60vh] bg-black overflow-hidden">
          {ep.stillPath && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-50 blur-sm scale-105"
              style={{ backgroundImage: `url(${ep.stillPath})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        </div>

        {/* Foreground Content Card */}
        <div className="container mx-auto px-4 md:px-8 relative z-10 -mt-36 md:-mt-48">
          <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
            {/* Episode Still Cover */}
            {ep.stillPath && (
              <div className="w-full md:w-80 shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/15 relative aspect-video bg-zinc-900 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ep.stillPath}
                  alt={ep.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
              </div>
            )}

            {/* Episode Info Header */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-amber-400 text-black text-xs font-black tracking-wider uppercase">
                  Season {ep.seasonNumber} &bull; Episode {ep.episodeNumber}
                </span>
                {ep.voteAverage > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/10 text-xs font-bold text-amber-300 flex items-center gap-1">
                    <Star size={12} fill="currentColor" />
                    {ep.voteAverage.toFixed(1)} / 10
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-3">
                {ep.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-zinc-400 mb-4">
                <span className="text-zinc-300 font-bold text-sm">{ep.showTitle}</span>
                {ep.airDate && (
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-amber-400" />
                    Aired {ep.airDate}
                  </span>
                )}
                {ep.runtime && (
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-cyan-400" />
                    {ep.runtime}
                  </span>
                )}
              </div>

              <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-normal max-w-3xl">
                {ep.overview}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Cast & Episode Crew */}
      <CastList cast={ep.guestCast} directors={ep.directors} source={source} />

      {/* Full Season Episode Selector Grid */}
      <MediaEpisodes
        showId={params.id}
        source={source}
        seasons={ep.seasons}
        seasonNumber={ep.seasonNumber}
        initialEpisodes={seasonEpisodes}
        activeEpisodeNumber={ep.episodeNumber}
      />

      <MediaFooter />
    </main>
  );
}
