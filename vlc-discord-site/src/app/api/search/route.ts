import { NextResponse } from 'next/server';
import { fetchTMDB } from '@/lib/api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json({ results: [] });
  }

  try {
    const data = await fetchTMDB(`/search/multi?query=${encodeURIComponent(query)}&include_adult=false`);
    return NextResponse.json(data);
  } catch (error) {
    console.error("TMDB search error:", error);
    return NextResponse.json({ results: [] }, { status: 500 });
  }
}
