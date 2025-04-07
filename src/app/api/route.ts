import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://uccricket.live/web-stories/feed/", {
      headers: { "User-Agent": "Mozilla/5.0" }, // Avoids blocking by some servers
    });

    if (!response.ok) throw new Error("Failed to fetch RSS feed");

    const text = await response.text(); // Get XML data as text
    // console.log(text);
    return new NextResponse(text, {
      headers: { "Content-Type": "application/xml" },
    });
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    return NextResponse.json({ error: "Failed to fetch RSS feed" }, { status: 500 });
  }
}
