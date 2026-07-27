import { NextRequest, NextResponse } from "next/server";

export interface RecentItem {
  id: string;
  title: string;
  posterPath: string | null;
  releaseYear: string;
  mediaType: "movie" | "show";
  source: "tmdb" | "tvmaze";
  url: string;
  viewedAt?: number;
}

// In-memory global store fallback for server runtime
let globalRecentItems: RecentItem[] = [];

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

async function fetchRedis(command: string, ...args: (string | number)[]) {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null;
  try {
    const res = await fetch(`${UPSTASH_URL}/${command}/${args.join("/")}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.result;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    // Attempt fetching from Redis if configured
    if (UPSTASH_URL && UPSTASH_TOKEN) {
      const rawData = await fetchRedis("lrange", "vlc_rpc_community_recent", 0, 19);
      if (Array.isArray(rawData)) {
        const parsed: RecentItem[] = rawData
          .map((itemStr) => {
            try {
              return typeof itemStr === "string" ? JSON.parse(itemStr) : itemStr;
            } catch {
              return null;
            }
          })
          .filter(Boolean);
        if (parsed.length > 0) {
          return NextResponse.json(parsed);
        }
      }
    }
  } catch (error) {
    console.error("Redis GET recent error:", error);
  }

  // Fallback to in-memory store
  return NextResponse.json(globalRecentItems.slice(0, 20));
}

export async function POST(req: NextRequest) {
  try {
    const body: RecentItem = await req.json();
    if (!body || !body.id || !body.title) {
      return NextResponse.json({ error: "Invalid item" }, { status: 400 });
    }

    const newItem: RecentItem = {
      id: body.id,
      title: body.title,
      posterPath: body.posterPath || null,
      releaseYear: body.releaseYear || "",
      mediaType: body.mediaType || "movie",
      source: body.source || "tmdb",
      url: body.url || `#`,
      viewedAt: Date.now(),
    };

    const itemKey = `${newItem.source}-${newItem.mediaType}-${newItem.id}`;

    // 1. Update In-Memory Store
    globalRecentItems = [
      newItem,
      ...globalRecentItems.filter((i) => `${i.source}-${i.mediaType}-${i.id}` !== itemKey),
    ].slice(0, 20);

    // 2. Update Redis if configured
    if (UPSTASH_URL && UPSTASH_TOKEN) {
      const itemStr = JSON.stringify(newItem);
      // Remove any duplicate entry
      await fetchRedis("lrem", "vlc_rpc_community_recent", 0, itemStr);
      // Push to left of list
      await fetchRedis("lpush", "vlc_rpc_community_recent", encodeURIComponent(itemStr));
      // Trim to 20 items
      await fetchRedis("ltrim", "vlc_rpc_community_recent", 0, 19);
    }

    return NextResponse.json({ success: true, items: globalRecentItems.slice(0, 20) });
  } catch (error) {
    console.error("POST recent error:", error);
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}
