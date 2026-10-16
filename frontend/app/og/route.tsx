import { ImageResponse } from "next/og";

// Brand share image for link previews (Facebook, WhatsApp, LinkedIn, X, Google Discover).
// /og?title=... captions the card with the page's headline.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") || "Best Consultancy in Bagbazar, Nepal").slice(0, 90);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #efe8fd 0%, #f8f5ff 55%, #ffffff 100%)",
          color: "#170b22",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              background: "#a020f0",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 40,
              fontWeight: 700,
            }}
          >
            N
          </div>
          <div style={{ fontSize: 38, fontWeight: 700, color: "#7a44dc" }}>Nexture Education</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 72, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1 }}>{title}</div>
          <div style={{ fontSize: 30, color: "#4d3a63" }}>
            Study abroad consultancy in Bagbazar, Kathmandu, Nepal
          </div>
        </div>

        <div style={{ display: "flex", height: 10, width: 220, background: "#8b55ea", borderRadius: 5 }} />
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400" },
    }
  );
}
