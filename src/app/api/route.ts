import { NextResponse } from "next/server";
import zlib from "zlib";
export async function GET() {
  try {
    const response = await fetch("https://uccricket.live/web-stories/feed/", {
      headers: { "User-Agent": "Mozilla/5.0" }, // Avoids blocking by some servers
    });

    if (!response.ok) throw new Error("Failed to fetch RSS feed");

    const text = await response.text(); // Get XML data as text
    // console.log(text);
    return createGzipResponse(text, "application/xml");
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    return NextResponse.json({ error: "Failed to fetch RSS feed" }, { status: 500 });
  }
}

function createGzipResponse(data: string | object, contentType = "application/json") {
  const jsonOrText = typeof data === "string" ? data : JSON.stringify(data);
  const gzipped = zlib.gzipSync(jsonOrText);

  return new NextResponse(gzipped, {
    status: 200,
    headers: {
      "Content-Encoding": "gzip",
      "Content-Type": contentType,
    },
  });
}
