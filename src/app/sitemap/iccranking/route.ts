import { NextResponse } from 'next/server';
    export async function GET() {

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/men/team/odi</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/men/batter/odi</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/men/bowler/odi</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/men/all-rounder/odi</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/men/team/test</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/men/batter/test</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/men/bowler/test</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/men/all-rounder/test</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/men/team/t20</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/men/batter/t20</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/men/bowler/t20</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/men/all-rounder/t20</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
       <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/women/team/odi</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/women/batter/odi</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/women/bowler/odi</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/women/all-rounder/odi</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
       <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/women/team/t20</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/women/batter/t20</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/women/bowler/t20</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/iccranking/women/all-rounder/t20</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
        
        </urlset>`;


    return new Response(sitemap, {
        headers: {
        'Content-Type': 'application/xml',
        },
    });
    }
