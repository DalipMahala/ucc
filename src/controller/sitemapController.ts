import db from "../config/db";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from '@/lib/aws';
import { urlStringEncode } from "@/utils/utility";

const BUCKET_NAME = 'uc-application';

export async function PlayerSiteMap() {
  try {
    const playerQuery = `SELECT pid, title, created_date FROM players`;
 
    const [playerResults]: any = await db.query(playerQuery);

    if (!playerResults || !playerResults.length) {
      console.log('No player results found');
      return;
    }

    const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${
          playerResults.map((player: any) => {
            if (!player.pid || !player.title) {
              console.warn('Invalid player data:', player);
              return '';
            }
            return `
              <url>
                <loc>http://13.202.213.65:3000/player/${urlStringEncode(player.title)}/${player.pid}</loc>
                <lastmod>${player.created_date ? new Date(player.created_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]}</lastmod>
                <changefreq>daily</changefreq>
                <priority>0.9</priority>
              </url>
            `;
          }).join('')
        }
      </urlset>`;

    const s3Key = `sitemap/players/player.xml`; 
    const params = {
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: xmlString,
      ContentType: 'application/xml',
      CacheControl: 'public, max-age=86400' // 24hr caching
    };

    await s3.send(new PutObjectCommand(params));
    console.log(`Sitemap successfully uploaded to s3://${BUCKET_NAME}/${s3Key}`);

  } catch (error) {
    console.error("Error in MatchInfo:", error);
    throw error; // Re-throw for calling function to handle
  }
}