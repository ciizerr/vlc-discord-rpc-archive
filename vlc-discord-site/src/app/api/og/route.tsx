import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getMovieDetails, getShowDetails, getPersonDetails } from "@/lib/api";

async function fetchImageAsBase64(url: string | null): Promise<string | null> {
  if (!url) return null;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/jpeg";
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return `data:${contentType};base64,${base64}`;
  } catch (e) {
    console.error("Error fetching image for OG:", url, e);
    return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "home";
    const source = (searchParams.get("source") || "tmdb") as "tmdb" | "tvmaze";
    const id = searchParams.get("id");
    const season = searchParams.get("season");
    const episode = searchParams.get("episode");

    // Fetch site logo as base64 for reliable Satori rendering
    const logoUrl = "https://vlc-rpc.vercel.app/assets/vlc-discord-icon.png";
    const logoBase64 = await fetchImageAsBase64(logoUrl);

    // ─────────────────────────────────────────────────────────────
    // 1. HOMEPAGE OG CARD (Discord Rich Presence Mockup)
    // ─────────────────────────────────────────────────────────────
    if (type === "home" || !id) {
      return new ImageResponse(
        (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#070709",
              position: "relative",
              fontFamily: "sans-serif",
            }}
          >
            {/* Ambient Background Glows */}
            <div
              style={{
                position: "absolute",
                top: "-100px",
                left: "200px",
                width: "800px",
                height: "800px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,149,0,0.12) 0%, rgba(0,0,0,0) 70%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-150px",
                right: "100px",
                width: "600px",
                height: "600px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(0,0,0,0) 70%)",
              }}
            />

            {/* Subtle Grid Pattern Overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
                opacity: 0.6,
              }}
            />

            {/* Main Content Container */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 10,
                gap: "28px",
              }}
            >
              {/* Site Badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 20px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(255, 149, 0, 0.12)",
                  border: "1px solid rgba(255, 149, 0, 0.3)",
                  color: "#FF9500",
                  fontSize: "14px",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                <span>VLC DISCORD RICH PRESENCE</span>
              </div>

              {/* Simulated Discord Rich Presence Card */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "24px",
                  width: "720px",
                  padding: "28px 32px",
                  borderRadius: "24px",
                  backgroundColor: "rgba(18, 18, 22, 0.85)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
                }}
              >
                {/* VLC Icon */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100px",
                    height: "100px",
                    borderRadius: "20px",
                    backgroundColor: "rgba(255, 149, 0, 0.15)",
                    border: "1px solid rgba(255, 149, 0, 0.3)",
                  }}
                >
                  {logoBase64 ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={logoBase64}
                      alt="VLC RPC"
                      width="72"
                      height="72"
                    />
                  ) : null}
                </div>

                {/* RPC Info Text */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                  <div style={{ fontSize: "12px", fontWeight: 800, color: "#818cf8", letterSpacing: "0.1em" }}>
                    PLAYING A GAME
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#ffffff" }}>
                    VLC Media Player
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "#fbbf24" }}>
                    Interstellar (2014) • Movie
                  </div>
                  <div style={{ fontSize: "13px", color: "#a1a1aa" }}>
                    01:24:15 elapsed • 02:49:00 total
                  </div>
                </div>

                {/* Live Playing Status Pulse Indicator */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    backgroundColor: "rgba(34, 197, 94, 0.15)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    color: "#4ade80",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "#4ade80",
                    }}
                  />
                  <span>Active</span>
                </div>
              </div>

              {/* Tagline Footer */}
              <div style={{ fontSize: "18px", color: "#a1a1aa", fontWeight: 500 }}>
                Native Windhawk Mod • Privacy First • Zero Performance Impact
              </div>
            </div>
          </div>
        ),
        { width: 1200, height: 630 }
      );
    }

    // ─────────────────────────────────────────────────────────────
    // 2. MEDIA / PERSON PAGES DYNAMIC OG CARDS
    // ─────────────────────────────────────────────────────────────
    let title = "VLC Discord RPC";
    let subtitle = "";
    let posterUrl = "";
    let backdropUrl = "";
    let rating = "";
    let year = "";
    let badgeText = "MEDIA";
    let extraMeta = "";

    if (type === "movie") {
      badgeText = "MOVIE";
      const movie = await getMovieDetails(id);
      title = movie.title;
      posterUrl = movie.posterPath || "";
      backdropUrl = movie.backdropPath || movie.posterPath || "";
      year = movie.releaseYear ? `${movie.releaseYear}` : "";
      rating = movie.rating > 0 ? `${movie.rating.toFixed(1)} / 10` : "";
      subtitle = movie.genres ? movie.genres.slice(0, 3).join(" • ") : "";
      extraMeta = movie.runtime ? `Runtime: ${movie.runtime}` : "";
    } else if (type === "show" || type === "season" || type === "episode") {
      badgeText = type.toUpperCase();
      const show = await getShowDetails(id, source);
      title = show.title;
      posterUrl = show.posterPath || "";
      backdropUrl = show.backdropPath || show.posterPath || "";
      year = show.releaseYear ? `${show.releaseYear}` : "";
      rating = show.rating > 0 ? `${show.rating.toFixed(1)} / 10` : "";
      subtitle = show.genres ? show.genres.slice(0, 3).join(" • ") : "";

      if (type === "season" && season) {
        title = `${show.title} — Season ${season}`;
      } else if (type === "episode" && season && episode) {
        title = `${show.title} — S${season}E${episode}`;
      }
    } else if (type === "person") {
      badgeText = "ACTOR / CREW";
      const person = await getPersonDetails(source, id);
      title = person.name;
      posterUrl = person.profilePath || "";
      backdropUrl = person.profilePath || "";
      subtitle = person.knownForDepartment ? `Known For: ${person.knownForDepartment}` : "Film & Television";
      extraMeta = person.placeOfBirth ? `Born: ${person.placeOfBirth}` : "";
    }

    // Convert external poster and backdrop images to base64 Data URLs for guaranteed Satori rendering
    const [posterBase64, backdropBase64] = await Promise.all([
      fetchImageAsBase64(posterUrl),
      fetchImageAsBase64(backdropUrl),
    ]);

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#09090b",
            position: "relative",
            fontFamily: "sans-serif",
            overflow: "hidden",
          }}
        >
          {/* Background Blurred Backdrop */}
          {backdropBase64 ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={backdropBase64}
              alt="Backdrop"
              width="1200"
              height="630"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "blur(30px) brightness(0.25)",
              }}
            />
          ) : null}

          {/* Dark Overlay Gradient */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to right, rgba(9,9,11,0.95) 0%, rgba(9,9,11,0.6) 100%)",
            }}
          />

          {/* Left: Poster Cover Art */}
          <div
            style={{
              display: "flex",
              paddingLeft: "60px",
              zIndex: 10,
            }}
          >
            {posterBase64 ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={posterBase64}
                alt={title}
                width="240"
                height="360"
                style={{
                  borderRadius: "24px",
                  objectFit: "cover",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
                }}
              />
            ) : (
              <div
                style={{
                  width: "240px",
                  height: "360px",
                  borderRadius: "24px",
                  backgroundColor: "#18181b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#71717a",
                  fontSize: "24px",
                  fontWeight: 700,
                }}
              >
                No Image
              </div>
            )}
          </div>

          {/* Right: Info Details */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingLeft: "48px",
              paddingRight: "60px",
              zIndex: 10,
              flex: 1,
              gap: "14px",
            }}
          >
            {/* Top Category Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: "999px",
                  backgroundColor: "#fbbf24",
                  color: "#000000",
                  fontSize: "12px",
                  fontWeight: 900,
                  letterSpacing: "0.1em",
                }}
              >
                {badgeText}
              </div>
              {year && (
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#a1a1aa" }}>
                  {year}
                </div>
              )}
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: title.length > 30 ? "38px" : "48px",
                fontWeight: 800,
                color: "#ffffff",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                maxHeight: "120px",
                overflow: "hidden",
              }}
            >
              {title}
            </div>

            {/* Subtitle / Genres */}
            {subtitle && (
              <div style={{ fontSize: "18px", fontWeight: 600, color: "#fbbf24" }}>
                {subtitle}
              </div>
            )}

            {/* Rating / Extra Metadata */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "4px" }}>
              {rating && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(251, 191, 36, 0.15)",
                    border: "1px solid rgba(251, 191, 36, 0.3)",
                    color: "#fef08a",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  <span>⭐ {rating}</span>
                </div>
              )}
              {extraMeta && (
                <div style={{ fontSize: "14px", color: "#a1a1aa", fontWeight: 500 }}>
                  {extraMeta}
                </div>
              )}
            </div>

            {/* Branding Watermark Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginTop: "16px",
                padding: "8px 16px",
                borderRadius: "12px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                alignSelf: "flex-start",
              }}
            >
              {logoBase64 ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={logoBase64}
                  alt="VLC RPC"
                  width="20"
                  height="20"
                />
              ) : null}
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#e4e4e7" }}>
                VLC Discord RPC
              </span>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (error) {
    console.error("OG Image generation error:", error);

    // Fallback Image
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#09090b",
            color: "#ffffff",
            fontFamily: "sans-serif",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://vlc-rpc.vercel.app/assets/vlc-discord-icon.png"
            alt="VLC RPC"
            width="80"
            height="80"
          />
          <div style={{ fontSize: "36px", fontWeight: 800, marginTop: "20px" }}>
            VLC Discord RPC
          </div>
          <div style={{ fontSize: "18px", color: "#a1a1aa", marginTop: "8px" }}>
            Native Rich Presence Mod for VLC Media Player
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }
}
