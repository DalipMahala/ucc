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
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/man/team/odis</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/man/batter/odis</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/man/bowler/odis</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/man/all-rounder/odis</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/man/team/tests</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/man/batter/tests</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/man/bowler/tests</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/man/all-rounder/tests</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/man/team/t20s</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/man/batter/t20s</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/man/bowler/t20s</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/man/all-rounder/t20s</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
       <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/woman/team/odis</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/woman/batter/odis</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/woman/bowler/odis</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/woman/all-rounder/odis</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
       <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/woman/team/t20s</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/woman/batter/t20s</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/woman/bowler/t20s</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/woman/all-rounder/t20s</loc>
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

