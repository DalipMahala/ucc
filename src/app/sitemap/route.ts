import { NextResponse } from 'next/server';
import { getPlayerCount, getMatchCount, getTeamCount } from "@/controller/sitemapController";


export async function GET() {
  // const matches = await getMatches();
  const batchSize = 100; // Max URLs per sitemap file
  // const batches = Math.ceil(matches.length / batchSize);
  const urls = [];
  const totalPlayer = await getPlayerCount();
  const playerPages = Math.ceil(totalPlayer/1000);
  for (let i = 1; i <= playerPages; i++) {
    urls.push(`${process.env.NEXT_PUBLIC_API_URL}/sitemap/players/${i}.xml`)
  }
  const totalMatch = await getMatchCount();
  const matchPages = Math.ceil(totalMatch/1000);
  for (let j = 1; j <= matchPages; j++) {
    urls.push(`${process.env.NEXT_PUBLIC_API_URL}/sitemap/matches/${j}.xml`)
  }
  const totalTeam = await getTeamCount();
  const teamPages = Math.ceil(totalTeam/1000);
  for (let k = 1; k <= teamPages; k++) {
    urls.push(`${process.env.NEXT_PUBLIC_API_URL}/sitemap/team/${k}.xml`)
  }

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/sitemap/series.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
       <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/sitemap/iccranking.xml</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
       
      ${urls.map((url) => `<url>
        <loc>${url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>`).join('\n')}
      </urlset>`;


  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

