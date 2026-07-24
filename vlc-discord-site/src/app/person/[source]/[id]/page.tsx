import { getPersonDetails } from "@/lib/api";
import MediaNavigation from "@/components/MediaNavigation";
import MediaFooter from "@/components/MediaFooter";
import MediaFallbackCard from "@/components/MediaFallbackCard";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { User, Calendar, MapPin, Film, Star, Sparkles, Award } from "lucide-react";

type Props = {
  params: Promise<{ source: string; id: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const params = await props.params;
    const source = params.source as 'tmdb' | 'tvmaze';
    if (source !== 'tmdb' && source !== 'tvmaze') return { title: "Person Details" };

    const person = await getPersonDetails(source, params.id);
    return {
      title: person.name,
      description: person.biography ? person.biography.slice(0, 160) : `Explore movies and TV shows starring ${person.name}.`,
    };
  } catch {
    return {
      title: "Person Details | VLC Discord RPC",
    };
  }
}

export default async function PersonPage(props: Props) {
  const params = await props.params;
  const source = params.source as 'tmdb' | 'tvmaze';

  if (source !== 'tmdb' && source !== 'tvmaze') {
    notFound();
  }

  let person;
  try {
    person = await getPersonDetails(source, params.id);
  } catch (error) {
    console.error("Person fetch error:", error);

    // TVMaze errors trigger standard 404
    if (source === 'tvmaze') {
      notFound();
    }

    // TMDb errors render MediaFallbackCard
    const isInvalidKey = error instanceof Error && (error.message.includes('INVALID_TMDB_KEY') || error.message.includes('401'));
    const isRateLimited = error instanceof Error && (error.message.includes('RATE_LIMITED') || error.message.includes('429'));
    return (
      <main className="min-h-screen bg-black text-white flex flex-col relative z-0 selection:bg-amber-500/30 selection:text-amber-200">
        <MediaNavigation title="Person Details" mediaType="show" backToPrevious={true} />
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
      <MediaNavigation title={person.name} mediaType="show" backToPrevious={true} />

      {/* Person Header / Hero Section */}
      <div className="relative w-full pt-28 pb-12 overflow-hidden bg-gradient-to-b from-zinc-950 via-black to-black">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
            
            {/* Headshot Avatar Cover */}
            <div className="w-48 sm:w-56 md:w-64 shrink-0 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/15 relative aspect-[2/3] bg-zinc-900 group">
              {person.profilePath ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={person.profilePath}
                  alt={person.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                  <User size={64} />
                </div>
              )}
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />
            </div>

            {/* Person Details Body */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-bold mb-3 uppercase tracking-wider">
                <Award size={14} />
                <span>{person.knownForDepartment || "Film & TV"}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                {person.name}
              </h1>

              {/* Quick Specs Pill Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6 text-xs text-zinc-400">
                {person.birthday && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-semibold text-zinc-300">
                    <Calendar size={13} className="text-amber-400" />
                    Born {person.birthday}
                  </span>
                )}

                {person.placeOfBirth && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-semibold text-zinc-300">
                    <MapPin size={13} className="text-cyan-400" />
                    {person.placeOfBirth}
                  </span>
                )}

                {person.popularity && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-semibold text-zinc-300">
                    <Sparkles size={13} className="text-amber-300" />
                    {person.popularity.toFixed(0)} Popularity Score
                  </span>
                )}
              </div>

              {/* Biography */}
              {person.biography ? (
                <div className="space-y-2 max-w-3xl">
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Biography</h3>
                  <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-normal whitespace-pre-line">
                    {person.biography}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-zinc-500 italic">
                  No biography overview available for {person.name}.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Known For / Filmography Section */}
      {person.credits.length > 0 && (
        <section className="container mx-auto px-4 md:px-8 py-12">
          <div className="flex items-center gap-2.5 mb-8">
            <Film size={22} className="text-amber-400" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Known For & Filmography</h2>
            <span className="text-xs font-medium text-zinc-500">({person.credits.length})</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
            {person.credits.map((credit, idx) => {
              const itemUrl = credit.mediaType === 'movie' 
                ? `/movie/${credit.id}` 
                : `/show/${credit.source}/${credit.id}`;

              return (
                <Link
                  key={`${credit.id}-${idx}`}
                  href={itemUrl}
                  className="flex flex-col group cursor-pointer"
                >
                  <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 group-hover:border-amber-400/50 shadow-md group-hover:shadow-2xl transition-all duration-300 mb-3">
                    {credit.posterPath ? (
                      <Image
                        src={credit.posterPath}
                        alt={credit.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <Film size={36} />
                      </div>
                    )}

                    {credit.voteAverage > 0 && (
                      <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-bold text-amber-300 flex items-center gap-1">
                        <Star size={10} fill="currentColor" />
                        {credit.voteAverage.toFixed(1)}
                      </div>
                    )}
                  </div>

                  <h3 
                    title={credit.title} 
                    className="font-bold text-xs sm:text-sm text-white group-hover:text-amber-300 transition-colors leading-snug truncate"
                  >
                    {credit.title}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1">
                    <span className="truncate max-w-[70%] font-medium">{credit.characterOrJob}</span>
                    {credit.releaseYear && <span className="font-semibold text-zinc-500">{credit.releaseYear}</span>}
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <MediaFooter />
    </main>
  );
}
