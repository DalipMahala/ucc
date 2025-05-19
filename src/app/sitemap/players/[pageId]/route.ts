// import { NextResponse, NextRequest } from 'next/server';
import { type NextRequest } from 'next/server'
import { getAllPlayer } from "@/controller/sitemapController";
import { urlStringEncode } from "@/utils/utility";


export async function GET ( req: NextRequest,  context: { params: { pageId: string } }): Promise<Response> {
  const { pageId } = context.params;
  const pageNum = parseInt(pageId);
  if (isNaN(pageNum)) throw new Error('Invalid page number')
  const limit = 1000
  const offset = (pageNum - 1) * limit

  const urls:any = await getAllPlayer(offset, limit);

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls?.map((url:any) => 
   `<url>
        <loc>${process.env.NEXT_PUBLIC_API_URL}/player/${urlStringEncode(url?.title)}/${url.pid}</loc>
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