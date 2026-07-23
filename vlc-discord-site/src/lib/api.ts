const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TVMAZE_BASE_URL = 'https://api.tvmaze.com';
const CACHE_TIME = 2592000; // 30 days

export interface MediaRecommendation {
  id: string;
  title: string;
  posterPath: string | null;
  backdropPath: string | null;
  voteAverage: number;
  releaseYear: string;
  source: 'tmdb' | 'tvmaze';
  mediaType: 'movie' | 'show';
}

export interface SeasonInfo {
  id: number;
  name: string;
  episodeCount: number;
  posterPath: string | null;
  airDate: string | null;
  seasonNumber?: number;
}

export interface EpisodeCardInfo {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  overview: string;
  stillPath: string | null;
  airDate: string | null;
  runtime: string | null;
  voteAverage: number;
}

export interface EpisodeDetails {
  id: string;
  showId: string;
  showTitle: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  overview: string;
  stillPath: string | null;
  airDate: string | null;
  runtime: string | null;
  voteAverage: number;
  mediaType: 'show';
  source: 'tmdb' | 'tvmaze';
  guestCast: { id: string; name: string; character: string; profilePath: string | null }[];
  directors: { id: string; name: string; job: string; profilePath: string | null }[];
  seasons: SeasonInfo[];
}

export interface MediaDetails {
  id: string;
  title: string;
  overview: string;
  tagline: string | null;
  posterPath: string | null;
  backdropPath: string | null;
  releaseYear: string;
  genres: string[];
  rating: number;
  voteCount: number;
  runtime: string | null;
  status: string | null;
  contentRating: string | null;
  country: string | null;
  language: string | null;
  imdbId: string | null;
  networks: string[];
  studioLogos: { name: string; logoPath: string | null }[];
  budget: string | null;
  revenue: string | null;
  keywords: string[];
  trailerKey: string | null;
  watchUrl: string | null;
  mediaType: 'movie' | 'show';
  source: 'tmdb' | 'tvmaze';
  directors: { id: string; name: string; job: string; profilePath: string | null }[];
  cast: { id: string; name: string; character: string; profilePath: string | null }[];
  seasons: SeasonInfo[];
  backdrops: string[];
  recommendations: MediaRecommendation[];
}

export async function fetchTMDB(endpoint: string) {
  if (!TMDB_API_KEY) throw new Error("TMDB_API_KEY_MISSING");
  const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}`;
  const res = await fetch(url, { next: { revalidate: CACHE_TIME } });
  if (!res.ok) {
    if (res.status === 401) throw new Error("INVALID_TMDB_KEY");
    if (res.status === 429) throw new Error("RATE_LIMITED");
    throw new Error(`TMDB error: ${res.statusText} (${res.status})`);
  }
  return res.json();
}

export async function fetchTVMaze(endpoint: string) {
  const url = `${TVMAZE_BASE_URL}${endpoint}`;
  const res = await fetch(url, { next: { revalidate: CACHE_TIME } });
  if (!res.ok) {
    if (res.status === 429) throw new Error("RATE_LIMITED");
    throw new Error(`TVMaze error: ${res.statusText} (${res.status})`);
  }
  return res.json();
}

function formatMinutes(mins?: number | null, isShow = false): string | null {
  if (!mins || mins <= 0) return isShow ? "TV Series" : null;
  const hours = Math.floor(mins / 60);
  const remainder = mins % 60;
  if (hours > 0) {
    return `${hours}h ${remainder > 0 ? `${remainder}m` : ''}`;
  }
  return `${remainder}m${isShow ? '/ep' : ''}`;
}

function formatCurrency(amount?: number | null): string | null {
  if (!amount || amount <= 0) return null;
  if (amount >= 1_000_000_000) return `$${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(0)}M`;
  return `$${amount.toLocaleString()}`;
}

export async function getMovieDetails(id: string): Promise<MediaDetails> {
  const data = await fetchTMDB(`/movie/${id}?append_to_response=credits,videos,recommendations,similar,images,keywords,release_dates,external_ids`);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trailer = data.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube') 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    || data.videos?.results?.find((v: any) => v.site === 'YouTube');
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const directors = data.credits?.crew?.filter((c: any) => c.job === 'Director' || c.job === 'Screenplay' || c.job === 'Writer')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((c: any) => ({
      id: c.id.toString(),
      name: c.name,
      job: c.job,
      profilePath: c.profile_path ? `https://image.tmdb.org/t/p/w200${c.profile_path}` : null,
    })) || [];

  const recs = (data.recommendations?.results?.length ? data.recommendations.results : data.similar?.results || [])
    .slice(0, 10)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((r: any) => ({
      id: r.id.toString(),
      title: r.title || r.name,
      posterPath: r.poster_path ? `https://image.tmdb.org/t/p/w500${r.poster_path}` : null,
      backdropPath: r.backdrop_path ? `https://image.tmdb.org/t/p/w780${r.backdrop_path}` : null,
      voteAverage: r.vote_average || 0,
      releaseYear: (r.release_date || r.first_air_date || '').substring(0, 4),
      source: 'tmdb' as const,
      mediaType: 'movie' as const,
    }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const studioLogos = data.production_companies?.slice(0, 3).map((p: any) => ({
    name: p.name,
    logoPath: p.logo_path ? `https://image.tmdb.org/t/p/w200${p.logo_path}` : null,
  })) || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const releaseDatesUS = data.release_dates?.results?.find((r: any) => r.iso_3166_1 === 'US') || data.release_dates?.results?.[0];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cert = releaseDatesUS?.release_dates?.find((d: any) => d.certification && d.certification.length > 0)?.certification || null;

  const country = data.production_countries?.[0]?.name || null;
  const language = data.spoken_languages?.[0]?.english_name || data.spoken_languages?.[0]?.name || null;
  const imdbId = data.external_ids?.imdb_id || data.imdb_id || null;

  return {
    id: data.id.toString(),
    title: data.title,
    overview: data.overview,
    tagline: data.tagline || null,
    posterPath: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
    backdropPath: data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : null,
    releaseYear: data.release_date?.substring(0, 4) || '',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    genres: data.genres?.map((g: any) => g.name) || [],
    rating: data.vote_average || 0,
    voteCount: data.vote_count || 0,
    runtime: formatMinutes(data.runtime),
    status: data.status || 'Released',
    contentRating: cert,
    country,
    language,
    imdbId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    networks: data.production_companies?.slice(0, 3).map((p: any) => p.name) || [],
    studioLogos,
    budget: formatCurrency(data.budget),
    revenue: formatCurrency(data.revenue),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keywords: data.keywords?.keywords?.slice(0, 8).map((k: any) => k.name) || [],
    trailerKey: trailer ? trailer.key : null,
    watchUrl: data.homepage || null,
    mediaType: 'movie',
    source: 'tmdb',
    directors,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cast: data.credits?.cast?.map((c: any) => ({
      id: c.id.toString(),
      name: c.name,
      character: c.character,
      profilePath: c.profile_path ? `https://image.tmdb.org/t/p/w200${c.profile_path}` : null,
    })) || [],
    seasons: [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    backdrops: data.images?.backdrops?.slice(0, 6).map((b: any) => `https://image.tmdb.org/t/p/w780${b.file_path}`) || [],
    recommendations: recs,
  };
}

async function getTVMazeDetails(tvmazeId: string): Promise<MediaDetails> {
  const data = await fetchTVMaze(`/shows/${tvmazeId}?embed[]=cast&embed[]=crew&embed[]=episodes&embed[]=seasons&embed[]=images`);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cast = data._embedded?.cast?.map((c: any) => ({
    id: c.person.id.toString(),
    name: c.person.name,
    character: c.character.name,
    profilePath: c.person.image?.medium || null,
  })) || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const directors = data._embedded?.crew?.filter((c: any) => 
    c.type === 'Creator' || c.type === 'Showrunner' || c.type === 'Executive Producer' || c.type === 'Director'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ).map((c: any) => ({
    id: c.person.id.toString(),
    name: c.person.name,
    job: c.type,
    profilePath: c.person.image?.medium || null,
  })) || [];

  const networkObj = data.network || data.webChannel;
  const studioLogos = networkObj ? [{
    name: networkObj.name,
    logoPath: networkObj.image?.medium || null,
  }] : [];

  // Count actual embedded episodes per season for accurate episodeCount
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const embeddedEpisodes: any[] = data._embedded?.episodes || [];
  const episodeCountBySeason: Record<number, number> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  embeddedEpisodes.forEach((ep: any) => {
    if (ep.season != null) {
      episodeCountBySeason[ep.season] = (episodeCountBySeason[ep.season] || 0) + 1;
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seasons = data._embedded?.seasons?.map((s: any) => ({
    id: s.id,
    name: `Season ${s.number}`,
    seasonNumber: s.number,
    episodeCount: s.episodeOrder || episodeCountBySeason[s.number] || 1,
    posterPath: s.image?.medium || null,
    airDate: s.premiereDate ? s.premiereDate.substring(0, 4) : null,
  })) || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageGallery = data._embedded?.images?.filter((img: any) => img.type === 'background' || img.type === 'banner')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((img: any) => img.resolutions?.original?.url || img.resolutions?.medium?.url)
    .filter(Boolean) || [];

  const backdrops = imageGallery.length > 0 
    ? imageGallery 
    : (data.image?.original ? [data.image.original] : []);

  return {
    id: data.id.toString(),
    title: data.name,
    overview: data.summary?.replace(/<[^>]*>?/gm, '') || '',
    tagline: data.type || null,
    posterPath: data.image?.original || null,
    backdropPath: backdrops[0] || data.image?.original || null,
    releaseYear: data.premiered?.substring(0, 4) || '',
    genres: data.genres || [],
    rating: data.rating?.average || 0,
    voteCount: 0,
    runtime: formatMinutes(data.averageRuntime || data.runtime, true),
    status: data.status || 'Ended',
    contentRating: null,
    country: networkObj?.country?.name || null,
    language: data.language || null,
    imdbId: data.externals?.imdb || null,
    networks: networkObj ? [networkObj.name] : [],
    studioLogos,
    budget: null,
    revenue: null,
    keywords: data.genres || [],
    trailerKey: null,
    watchUrl: data.officialSite || data.url || null,
    mediaType: 'show',
    source: 'tvmaze',
    directors,
    cast,
    seasons,
    backdrops,
    recommendations: [],
  };
}

export async function getShowDetails(id: string, source: 'tmdb' | 'tvmaze'): Promise<MediaDetails> {
  if (source === 'tmdb') {
    try {
      const data = await fetchTMDB(`/tv/${id}?append_to_response=credits,videos,recommendations,similar,images,keywords,content_ratings,external_ids`);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const trailer = data.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube') 
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
        || data.videos?.results?.find((v: any) => v.site === 'YouTube');
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const directors = data.created_by?.map((c: any) => ({
        id: c.id.toString(),
        name: c.name,
        job: 'Creator',
        profilePath: c.profile_path ? `https://image.tmdb.org/t/p/w200${c.profile_path}` : null,
      })) || [];

      const recs = (data.recommendations?.results?.length ? data.recommendations.results : data.similar?.results || [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .slice(0, 10).map((r: any) => ({
          id: r.id.toString(),
          title: r.name || r.title,
          posterPath: r.poster_path ? `https://image.tmdb.org/t/p/w500${r.poster_path}` : null,
          backdropPath: r.backdrop_path ? `https://image.tmdb.org/t/p/w780${r.backdrop_path}` : null,
          voteAverage: r.vote_average || 0,
          releaseYear: (r.first_air_date || r.release_date || '').substring(0, 4),
          source: 'tmdb' as const,
          mediaType: 'show' as const,
        }));

      const runtimeStr = data.episode_run_time?.length 
        ? formatMinutes(data.episode_run_time[0], true)
        : (data.number_of_seasons ? `${data.number_of_seasons} Season${data.number_of_seasons > 1 ? 's' : ''}` : 'TV Series');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const studioLogos = data.networks?.slice(0, 3).map((n: any) => ({
        name: n.name,
        logoPath: n.logo_path ? `https://image.tmdb.org/t/p/w200${n.logo_path}` : null,
      })) || [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ratingUS = data.content_ratings?.results?.find((r: any) => r.iso_3166_1 === 'US') || data.content_ratings?.results?.[0];
      const cert = ratingUS?.rating || null;

      const country = data.production_countries?.[0]?.name || data.origin_country?.[0] || null;
      const language = data.spoken_languages?.[0]?.english_name || data.spoken_languages?.[0]?.name || null;
      const imdbId = data.external_ids?.imdb_id || null;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const seasons = data.seasons?.map((s: any) => ({
        id: s.id,
        name: s.name,
        seasonNumber: s.season_number,
        episodeCount: s.episode_count || 0,
        posterPath: s.poster_path ? `https://image.tmdb.org/t/p/w200${s.poster_path}` : null,
        airDate: s.air_date ? s.air_date.substring(0, 4) : null,
      })) || [];

      return {
        id: data.id.toString(),
        title: data.name,
        overview: data.overview,
        tagline: data.tagline || (data.number_of_episodes ? `${data.number_of_episodes} Episodes` : null),
        posterPath: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
        backdropPath: data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : null,
        releaseYear: data.first_air_date?.substring(0, 4) || '',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        genres: data.genres?.map((g: any) => g.name) || [],
        rating: data.vote_average || 0,
        voteCount: data.vote_count || 0,
        runtime: runtimeStr,
        status: data.status || 'Returning Series',
        contentRating: cert,
        country,
        language,
        imdbId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        networks: data.networks?.map((n: any) => n.name) || [],
        studioLogos,
        budget: null,
        revenue: null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        keywords: data.keywords?.results?.slice(0, 8).map((k: any) => k.name) || [],
        trailerKey: trailer ? trailer.key : null,
        watchUrl: data.homepage || null,
        mediaType: 'show',
        source: 'tmdb',
        directors,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cast: data.credits?.cast?.map((c: any) => ({
          id: c.id.toString(),
          name: c.name,
          character: c.character,
          profilePath: c.profile_path ? `https://image.tmdb.org/t/p/w200${c.profile_path}` : null,
        })) || [],
        seasons,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        backdrops: data.images?.backdrops?.slice(0, 6).map((b: any) => `https://image.tmdb.org/t/p/w780${b.file_path}`) || [],
        recommendations: recs,
      };
    } catch (e) {
      console.warn('TMDb failed, trying TVMaze fallback...', e);
      try {
        const lookup = await fetchTVMaze(`/lookup/shows?themoviedb=${id}`);
        return await getTVMazeDetails(lookup.id.toString());
      } catch {
        if (e instanceof Error && e.message.includes('RATE_LIMITED')) {
          throw new Error('RATE_LIMITED');
        }
        if (e instanceof Error && (e.message.includes('INVALID_TMDB_KEY') || e.message.includes('401'))) {
          throw new Error('INVALID_TMDB_KEY');
        }
        throw new Error('SHOW_NOT_FOUND');
      }
    }
  } else {
    return getTVMazeDetails(id);
  }
}

export async function getSeasonEpisodes(
  source: 'tmdb' | 'tvmaze',
  showId: string,
  seasonNumber: number
): Promise<EpisodeCardInfo[]> {
  if (source === 'tmdb') {
    try {
      const data = await fetchTMDB(`/tv/${showId}/season/${seasonNumber}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.episodes?.map((ep: any) => ({
        id: ep.id.toString(),
        seasonNumber: ep.season_number,
        episodeNumber: ep.episode_number,
        title: ep.name,
        overview: ep.overview,
        stillPath: ep.still_path ? `https://image.tmdb.org/t/p/w780${ep.still_path}` : null,
        airDate: ep.air_date ? ep.air_date.substring(0, 4) : null,
        runtime: ep.runtime ? `${ep.runtime}m` : null,
        voteAverage: ep.vote_average || 0,
      })) || [];
    } catch {
      return [];
    }
  } else {
    try {
      const allEpisodes = await fetchTVMaze(`/shows/${showId}/episodes`);
      // TVMaze ignores ?season= param — filter client-side
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const episodes = (allEpisodes as any[]).filter((ep: any) => ep.season === seasonNumber);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return episodes.map((ep: any) => ({
        id: ep.id.toString(),
        seasonNumber: ep.season,
        episodeNumber: ep.number,
        title: ep.name,
        overview: ep.summary?.replace(/<[^>]*>?/gm, '') || '',
        stillPath: ep.image?.original || ep.image?.medium || null,
        airDate: ep.airdate || null,
        runtime: ep.runtime ? `${ep.runtime}m` : null,
        voteAverage: ep.rating?.average || 0,
      }));
    } catch {
      return [];
    }
  }
}

export async function getEpisodeDetails(
  source: 'tmdb' | 'tvmaze',
  showId: string,
  seasonNumber: number,
  episodeNumber: number
): Promise<EpisodeDetails> {
  const show = await getShowDetails(showId, source);

  if (source === 'tmdb') {
    const data = await fetchTMDB(`/tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}?append_to_response=credits`);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const guestCast = data.credits?.guest_stars?.map((c: any) => ({
      id: c.id.toString(),
      name: c.name,
      character: c.character,
      profilePath: c.profile_path ? `https://image.tmdb.org/t/p/w200${c.profile_path}` : null,
    })) || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const directors = data.credits?.crew?.filter((c: any) => c.job === 'Director' || c.job === 'Writer')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((c: any) => ({
        id: c.id.toString(),
        name: c.name,
        job: c.job,
        profilePath: c.profile_path ? `https://image.tmdb.org/t/p/w200${c.profile_path}` : null,
      })) || [];

    return {
      id: data.id.toString(),
      showId,
      showTitle: show.title,
      seasonNumber: data.season_number,
      episodeNumber: data.episode_number,
      title: data.name,
      overview: data.overview || show.overview,
      stillPath: data.still_path ? `https://image.tmdb.org/t/p/original${data.still_path}` : show.backdropPath,
      airDate: data.air_date ? data.air_date.substring(0, 4) : null,
      runtime: data.runtime ? `${data.runtime}m` : null,
      voteAverage: data.vote_average || 0,
      mediaType: 'show',
      source: 'tmdb',
      guestCast,
      directors,
      seasons: show.seasons,
    };
  } else {
    const data = await fetchTVMaze(`/shows/${showId}/episodebynumber?season=${seasonNumber}&number=${episodeNumber}`);
    
    return {
      id: data.id.toString(),
      showId,
      showTitle: show.title,
      seasonNumber: data.season,
      episodeNumber: data.number,
      title: data.name,
      overview: data.summary?.replace(/<[^>]*>?/gm, '') || show.overview,
      stillPath: data.image?.original || data.image?.medium || show.backdropPath,
      airDate: data.airdate ? data.airdate.substring(0, 4) : null,
      runtime: data.runtime ? `${data.runtime}m` : null,
      voteAverage: data.rating?.average || 0,
      mediaType: 'show',
      source: 'tvmaze',
      guestCast: show.cast.slice(0, 6),
      directors: show.directors,
      seasons: show.seasons,
    };
  }
}

export interface PersonCredit {
  id: string;
  title: string;
  characterOrJob: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseYear: string;
  mediaType: 'movie' | 'show';
  source: 'tmdb' | 'tvmaze';
  voteAverage: number;
}

export interface PersonDetails {
  id: string;
  name: string;
  biography: string;
  profilePath: string | null;
  birthday: string | null;
  deathday: string | null;
  placeOfBirth: string | null;
  knownForDepartment: string | null;
  popularity: number | null;
  imdbId: string | null;
  source: 'tmdb' | 'tvmaze';
  credits: PersonCredit[];
}

export async function getPersonDetails(source: 'tmdb' | 'tvmaze', personId: string): Promise<PersonDetails> {
  if (source === 'tmdb') {
    const data = await fetchTMDB(`/person/${personId}?append_to_response=combined_credits,external_ids`);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const castCredits: PersonCredit[] = (data.combined_credits?.cast || []).map((c: any) => ({
      id: c.id.toString(),
      title: c.title || c.name || "Untitled",
      characterOrJob: c.character ? `as ${c.character}` : "Actor",
      posterPath: c.poster_path ? `https://image.tmdb.org/t/p/w500${c.poster_path}` : null,
      backdropPath: c.backdrop_path ? `https://image.tmdb.org/t/p/w780${c.backdrop_path}` : null,
      releaseYear: (c.release_date || c.first_air_date || '').substring(0, 4),
      mediaType: c.media_type === 'movie' ? 'movie' : 'show',
      source: 'tmdb',
      voteAverage: c.vote_average || 0,
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const crewCredits: PersonCredit[] = (data.combined_credits?.crew || []).map((c: any) => ({
      id: c.id.toString(),
      title: c.title || c.name || "Untitled",
      characterOrJob: c.job || "Crew",
      posterPath: c.poster_path ? `https://image.tmdb.org/t/p/w500${c.poster_path}` : null,
      backdropPath: c.backdrop_path ? `https://image.tmdb.org/t/p/w780${c.backdrop_path}` : null,
      releaseYear: (c.release_date || c.first_air_date || '').substring(0, 4),
      mediaType: c.media_type === 'movie' ? 'movie' : 'show',
      source: 'tmdb',
      voteAverage: c.vote_average || 0,
    }));

    // Combine & remove duplicates by ID + mediaType
    const allCreditsMap = new Map<string, PersonCredit>();
    [...castCredits, ...crewCredits].forEach(item => {
      const key = `${item.mediaType}-${item.id}`;
      if (!allCreditsMap.has(key)) {
        allCreditsMap.set(key, item);
      }
    });

    const credits = Array.from(allCreditsMap.values()).slice(0, 24);

    return {
      id: data.id.toString(),
      name: data.name,
      biography: data.biography || "",
      profilePath: data.profile_path ? `https://image.tmdb.org/t/p/w500${data.profile_path}` : null,
      birthday: data.birthday || null,
      deathday: data.deathday || null,
      placeOfBirth: data.place_of_birth || null,
      knownForDepartment: data.known_for_department || "Acting",
      popularity: data.popularity || null,
      imdbId: data.external_ids?.imdb_id || null,
      source: 'tmdb',
      credits,
    };
  } else {
    const [data, creditsData] = await Promise.all([
      fetchTVMaze(`/people/${personId}`),
      fetchTVMaze(`/people/${personId}/castcredits?embed=show`),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const credits: PersonCredit[] = (creditsData || []).map((c: any) => {
      const show = c._embedded?.show;
      if (!show) return null;
      return {
        id: show.id.toString(),
        title: show.name,
        characterOrJob: c._links?.character?.href ? "Actor" : "Cast",
        posterPath: show.image?.original || show.image?.medium || null,
        backdropPath: show.image?.original || null,
        releaseYear: show.premiered ? show.premiered.substring(0, 4) : "",
        mediaType: 'show' as const,
        source: 'tvmaze' as const,
        voteAverage: show.rating?.average || 0,
      };
    }).filter(Boolean).slice(0, 24);

    return {
      id: data.id.toString(),
      name: data.name,
      biography: "",
      profilePath: data.image?.original || data.image?.medium || null,
      birthday: data.birthday || null,
      deathday: data.deathday || null,
      placeOfBirth: data.country?.name || null,
      knownForDepartment: "Acting",
      popularity: null,
      imdbId: data.externals?.imdb || null,
      source: 'tvmaze',
      credits,
    };
  }
}
