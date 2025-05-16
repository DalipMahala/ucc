import { NextResponse } from 'next/server';
import { getAllSeries } from "@/controller/sitemapController";
import { urlStringEncode } from "@/utils/utility";
    export async function GET() {
    // const matches = await getMatches();
    const batchSize = 100; // Max URLs per sitemap file
    // const batches = Math.ceil(matches.length / batchSize);

    const urls:any = await getAllSeries();
    console.log("test",urls);
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/series</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
       <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/series/international</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
       <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/series/women</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
       <url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/series/domestic</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
    ${urls?.map((url:any) => 
    `<url>
            <loc>${process.env.NEXT_PUBLIC_API_URL}/series/${urlStringEncode(url?.title)}-${url?.season}/${url.cid}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.9</priority>
        </url>
        <url>
            <loc>${process.env.NEXT_PUBLIC_API_URL}/series/${urlStringEncode(url?.title)}-${url?.season}/${url.cid}/schedule-results</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.9</priority>
        </url>
        <url>
            <loc>${process.env.NEXT_PUBLIC_API_URL}/series/${urlStringEncode(url?.title)}-${url?.season}/${url.cid}/squads</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.9</priority>
        </url>
        <url>
            <loc>${process.env.NEXT_PUBLIC_API_URL}/series/${urlStringEncode(url?.title)}-${url?.season}/${url.cid}/points-table</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.9</priority>
        </url>
        <url>
            <loc>${process.env.NEXT_PUBLIC_API_URL}/series/${urlStringEncode(url?.title)}-${url?.season}/${url.cid}/news</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.9</priority>
        </url>
        `).join('\n')}
        
        </urlset>`;


    return new Response(sitemap, {
        headers: {
        'Content-Type': 'application/xml',
        },
    });
    }
