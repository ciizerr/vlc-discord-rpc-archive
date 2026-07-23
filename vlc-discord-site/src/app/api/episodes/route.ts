import { NextRequest, NextResponse } from "next/server";
import { getSeasonEpisodes } from "@/lib/api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const source = (searchParams.get("source") as 'tmdb' | 'tvmaze') || 'tmdb';
  const showId = searchParams.get("showId");
  const seasonStr = searchParams.get("season");
  const season = seasonStr !== null ? parseInt(seasonStr, 10) : 1;

  if (!showId || isNaN(season)) {
    return NextResponse.json([], { status: 400 });
  }

  try {
    const episodes = await getSeasonEpisodes(source, showId, season);
    return NextResponse.json(episodes);
  } catch (err) {
    console.error("API /api/episodes error:", err);
    return NextResponse.json([]);
  }
}
