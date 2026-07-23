const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TVMAZE_BASE_URL = 'https://api.tvmaze.com';
const CACHE_TIME = 2592000; // 30 days

export interface MediaDetails {
  id: string;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseYear: string;
  genres: string[];
  rating: number;
  trailerKey: string | null;
  cast: { id: string; name: string; character: string; profilePath: string | null }[];
}

export async function fetchTMDB(endpoint: string) {
  if (!TMDB_API_KEY) throw new Error("TMDB_API_KEY is not set in environment variables");
  const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}`;
  const res = await fetch(url, { next: { revalidate: CACHE_TIME } });
  if (!res.ok) throw new Error(`TMDB error: ${res.statusText} (${res.status})`);
  return res.json();
}

export async function fetchTVMaze(endpoint: string) {
  const url = `${TVMAZE_BASE_URL}${endpoint}`;
  const res = await fetch(url, { next: { revalidate: CACHE_TIME } });
  if (!res.ok) throw new Error(`TVMaze error: ${res.statusText} (${res.status})`);
  return res.json();
}

export async function getMovieDetails(id: string): Promise<MediaDetails> {
  const data = await fetchTMDB(`/movie/${id}?append_to_response=credits,videos`);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const trailer = data.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
  
  return {
    id: data.id.toString(),
    title: data.title,
    overview: data.overview,
    posterPath: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
    backdropPath: data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : null,
    releaseYear: data.release_date?.substring(0, 4) || '',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    genres: data.genres?.map((g: any) => g.name) || [],
    rating: data.vote_average,
    trailerKey: trailer ? trailer.key : null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cast: data.credits?.cast?.map((c: any) => ({
      id: c.id.toString(),
      name: c.name,
      character: c.character,
      profilePath: c.profile_path ? `https://image.tmdb.org/t/p/w200${c.profile_path}` : null,
    })) || [],
  };
}

async function getTVMazeDetails(tvmazeId: string): Promise<MediaDetails> {
  const data = await fetchTVMaze(`/shows/${tvmazeId}?embed=cast`);
  return {
    id: data.id.toString(),
    title: data.name,
    overview: data.summary?.replace(/<[^>]*>?/gm, '') || '', // strip html tags
    posterPath: data.image?.original || null,
    backdropPath: data.image?.original || null,
    releaseYear: data.premiered?.substring(0, 4) || '',
    genres: data.genres || [],
    rating: data.rating?.average || 0,
    trailerKey: null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cast: data._embedded?.cast?.map((c: any) => ({
      id: c.person.id.toString(),
      name: c.person.name,
      character: c.character.name,
      profilePath: c.person.image?.medium || null,
    })) || [],
  };
}

export async function getShowDetails(id: string, source: 'tmdb' | 'tvmaze'): Promise<MediaDetails> {
  if (source === 'tmdb') {
    try {
      const data = await fetchTMDB(`/tv/${id}?append_to_response=credits,videos`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const trailer = data.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
      return {
        id: data.id.toString(),
        title: data.name,
        overview: data.overview,
        posterPath: data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null,
        backdropPath: data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : null,
        releaseYear: data.first_air_date?.substring(0, 4) || '',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        genres: data.genres?.map((g: any) => g.name) || [],
        rating: data.vote_average,
        trailerKey: trailer ? trailer.key : null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cast: data.credits?.cast?.map((c: any) => ({
          id: c.id.toString(),
          name: c.name,
          character: c.character,
          profilePath: c.profile_path ? `https://image.tmdb.org/t/p/w200${c.profile_path}` : null,
        })) || [],
      };
    } catch (e) {
      console.warn('TMDb failed, trying TVMaze fallback...', e);
      const lookup = await fetchTVMaze(`/lookup/shows?themoviedb=${id}`);
      return getTVMazeDetails(lookup.id.toString());
    }
  } else {
    return getTVMazeDetails(id);
  }
}
