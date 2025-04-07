import { httpGet } from "@/lib/http";
import redis from "../config/redis";
import db from "../config/db";
import fs from "fs";
import s3 from '@/lib/aws';
import { GetObjectCommand } from '@aws-sdk/client-s3';

const BUCKET_NAME = 'uc-application';

export async function PlayerStatsOld(pid: number) {
  if (!pid) {
    return { notFound: true }; // Handle undefined ID gracefully
  }
  const CACHE_KEY = "player_info";
  const CACHE_TTL = 600;
  const API_URL =
    "https://rest.entitysport.com/exchange/players/" +
    pid +
    "/stats?token=7b58d13da34a07b0a047e129874fdbf4";

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    console.log("coming from cache live_matches");
    return JSON.parse(cachedData);
  }

  const data = await httpGet(API_URL);
  const playerProfile = data?.response || [];
  // const pdata = playerProfile?.[playerRole]?.[matchType];
  // console.log("pl", pid);
  if (playerProfile.length > 0) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(playerProfile));
  }
  // console.log("coming from API live_matches");
  return playerProfile;
}

export async function PlayerStats(pid: number) {
    if (!pid) {
      return { notFound: true };
    }
    const CACHE_KEY = "players_info_"+pid;
    const CACHE_TTL = 60;
  
    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) {
      
      return JSON.parse(cachedData);
    }
    
 
    const [rows]: [any[], any]  = await db.execute('SELECT * FROM player_stats WHERE pid = ?',[pid]);
    if (!rows || rows.length === 0) {
      return null;
    }
    const fileName =   rows[0].fileName;
    
    try {
      const params = {
        Bucket: BUCKET_NAME,
        Key: fileName,  // S3 file path
      };
  
      // Get object from S3
      const command = new GetObjectCommand(params);
      const data = await s3.send(command);
  
      // Convert the stream to a buffer
      const streamToBuffer = (stream: any) =>
        new Promise<Buffer>((resolve, reject) => {
          const chunks: any[] = [];
          stream.on('data', (chunk: any) => chunks.push(chunk));
          stream.on('end', () => resolve(Buffer.concat(chunks)));
          stream.on('error', reject);
        });
  
      const fileData = await streamToBuffer(data.Body);
  
      // Parse JSON content
      const playerStats = JSON.parse(fileData.toString('utf-8'));
  
       
        if (playerStats.length > 0) {
          await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(playerStats));
        }
        return playerStats;
        
        
    } catch (error) {
        console.error(`Error reading match data:`, error);
        return null;
    }
    
}


  export async function PlayerAdvanceStats(pid: number) {
    if (!pid) {
      return { notFound: true };
    }
    const CACHE_KEY = "players_advance_info_"+pid;
    const CACHE_TTL = 60;
  
    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) {
      
      return JSON.parse(cachedData);
    }
    
 
    const [rows]: [any[], any]  = await db.execute('SELECT * FROM player_advance_stats WHERE pid = ?',[pid]);
    if (!rows || rows.length === 0) {
      return null;
    }
    const fileName =   rows[0].fileName;
    try {
      const params = {
        Bucket: BUCKET_NAME,
        Key: fileName,  // S3 file path
      };
  
      // Get object from S3
      const command = new GetObjectCommand(params);
      const data = await s3.send(command);
  
      // Convert the stream to a buffer
      const streamToBuffer = (stream: any) =>
        new Promise<Buffer>((resolve, reject) => {
          const chunks: any[] = [];
          stream.on('data', (chunk: any) => chunks.push(chunk));
          stream.on('end', () => resolve(Buffer.concat(chunks)));
          stream.on('error', reject);
        });
  
      const fileData = await streamToBuffer(data.Body);
  
      // Parse JSON content
      const playerAdvStats = JSON.parse(fileData.toString('utf-8'));
  
       
        if (playerAdvStats.length > 0) {
          await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(playerAdvStats));
        }
        return playerAdvStats;
        
        
    } catch (error) {
        console.error(`Error reading player data:`, error);
        return null;
    }
    
  }
export async function PlayerAdvanceStatsOld(pid: number) {
  if (!pid) {
    return { notFound: true }; // Handle undefined ID gracefully
  }
  const CACHE_KEY = "player_advance_stats";
  const CACHE_TTL = 600;
  const API_URL =
    "https://rest.entitysport.com/v4/players/" +
    pid +
    "/advancestats?token=7b58d13da34a07b0a047e129874fdbf4";

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    console.log("coming from cache live_matches");
    return JSON.parse(cachedData);
  }

  const data = await httpGet(API_URL);
  const playerStats = data?.response || [];
  // console.log("pl", pid);
  if (playerStats.length > 0) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(playerStats));
  }
  // console.log("coming from API live_matches");
  return playerStats;
}

export async function Ranking() {
  const CACHE_KEY = "iccranking";
  const CACHE_TTL = 6000;
  const API_URL =
    "https://rest.entitysport.com/exchange/iccranks?token=7b58d13da34a07b0a047e129874fdbf4";

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    console.log("coming from cache live_matches");
    return JSON.parse(cachedData);
  }

  const data = await httpGet(API_URL);
  const ranking = data?.response || [];
  // console.log("ranking", ranking);
  if (ranking.length > 0) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(ranking));
  }
  // console.log("coming from API live_matches");
  return ranking;
}

export async function PlayerProfile(pid: number) {
  if (!pid) {
    return { notFound: true };
  }
  const CACHE_KEY = "players_profile_"+pid;
  const CACHE_TTL = 6;

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    
    return JSON.parse(cachedData);
  }
  

  const data  = await db.execute('SELECT * FROM players WHERE pid = ?',[pid]);
  const players = data[0] || [];
  if (data.length > 0) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(players));
  }
  return players;
    
  
}
