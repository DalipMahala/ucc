import { NextResponse } from 'next/server';

// Fetch matches from your DB or API
async function getMatches() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/match/completedMatches`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_TOKEN}`,
    },
    cache: "no-store",
  });
  const data = await res.json();
  return data.data;
}

export async function GET() {
  const matches = await getMatches();
  const batchSize = 10; // Max URLs per sitemap file
  const batches = Math.ceil(matches.length / batchSize);

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  `;

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    sitemap += `
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/match/${match.match_id}</loc>
        <lastmod>${new Date(match.match_info.date_end_ist).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
    `;
  }

  sitemap += `</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
