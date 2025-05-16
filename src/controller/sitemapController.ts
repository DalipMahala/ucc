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

export async function fetchMatches(offset: number, limit: number) {
  try {
    const matchQuery = `SELECT id, match_url_short, updated_date FROM matches ORDER BY id asc LIMIT ${limit} OFFSET ${offset}`;
 
    return await db.query(matchQuery);


  } catch (error) {
    console.error("Error in MatchInfo:", error);
    throw error; // Re-throw for calling function to handle
  }
}
export async function getAllSeries() {
  try {
    const seriesQuery = `SELECT cid, title, season, updated_date FROM competitions ORDER BY cid asc `;
 
    const data =  await db.query(seriesQuery);
    return data[0] || [];

  } catch (error) {
    console.error("Error in MatchInfo:", error);
    throw error; // Re-throw for calling function to handle
  }
}
export async function getAllPlayer(offset:number, limit:number) {
  try {
    const seriesQuery = `SELECT pid, title, updated_date FROM players ORDER BY pid asc LIMIT ${limit} OFFSET ${offset}`;
 
    const data =  await db.query(seriesQuery);
    return data[0] || [];

  } catch (error) {
    console.error("Error in MatchInfo:", error);
    throw error; // Re-throw for calling function to handle
  }
}

export async function getAllMatch(offset:number, limit:number) {
  try {
    const teamQuery = `SELECT id, match_id, match_url_full, match_url_short, JSON_UNQUOTE(JSON_EXTRACT(competition, '$.title')) as compitition, updated_date FROM matches where commentary = 1 ORDER BY id asc LIMIT ${limit} OFFSET ${offset}`;
 
    const data =  await db.query(teamQuery);
    return data[0] || [];

  } catch (error) {
    console.error("Error in Team:", error);
    throw error; // Re-throw for calling function to handle
  }
}

export async function getAllTeam(offset:number, limit:number) {
  try {
    const teamQuery = `SELECT tid, title, updated_date FROM teams ORDER BY tid asc LIMIT ${limit} OFFSET ${offset}`;
 
    const data =  await db.query(teamQuery);
    return data[0] || [];

  } catch (error) {
    console.error("Error in Team:", error);
    throw error; // Re-throw for calling function to handle
  }
}

export async function getPlayerCount(){
  try {
    const seriesQuery = `SELECT count(*) as total FROM players`;
 
    const [rows]:any = await db.query(seriesQuery);
    return rows[0]?.total;

  } catch (error) {
    console.error("Error in MatchInfo:", error);
    throw error; // Re-throw for calling function to handle
  }
} 
export async function getMatchCount(){
  try {
    const seriesQuery = `SELECT count(*) as total FROM matches where commentary = 1`;
 
    const [rows]:any = await db.query(seriesQuery);
    return rows[0]?.total;

  } catch (error) {
    console.error("Error in MatchInfo:", error);
    throw error; // Re-throw for calling function to handle
  }
} 
export async function getTeamCount(){
  try {
    const seriesQuery = `SELECT count(*) as total FROM teams`;
 
    const [rows]:any = await db.query(seriesQuery);
    return rows[0]?.total;

  } catch (error) {
    console.error("Error in MatchInfo:", error);
    throw error; // Re-throw for calling function to handle
  }
}