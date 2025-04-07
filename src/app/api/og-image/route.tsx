import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Live Cricket Score";

    return new ImageResponse(
        (
            <div
                style={{
                    width: 600,
                    height: 330,
                    backgroundColor: "#1A202C",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 50,
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "20px",
                }}
            >
                {title}
            </div>
        ),
        {
            width: 1200,
            height: 630,
            headers: {
                "Content-Type": "image/webp", // Set WebP format
                "Cache-Control": "public, max-age=86400", // Cache for 1 day
              },
        }
    );
}
