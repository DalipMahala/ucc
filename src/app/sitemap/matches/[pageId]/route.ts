// import { NextResponse, NextRequest } from 'next/server';
import { type NextRequest } from 'next/server'
import { getAllMatch } from "@/controller/sitemapController";
import { urlStringEncode } from "@/utils/utility";


export async function GET ( req: NextRequest, { params }: { params: { pageId: number } }): Promise<Response> {
  const pageNum = params.pageId;
  if (isNaN(pageNum)) throw new Error('Invalid page number')
  const limit = 1000
  const offset = (pageNum - 1) * limit

  const urls:any = await getAllMatch(offset, limit);

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls?.map((url:any) => 
   `<url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/moreinfo/${url?.compitition === 'Indian Premier League' ? url?.match_url_short : url?.match_url_full}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
       `).join('\n')}
      
      </urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
