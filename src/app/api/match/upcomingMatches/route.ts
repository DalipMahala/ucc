import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db"; // Ensure correct import path for DB
import redis from "@/config/redis";
import fs from "fs";
import s3 from '@/lib/aws';
import { GetObjectCommand } from '@aws-sdk/client-s3';

const BUCKET_NAME = 'uc-application';

export async function GET(req: NextRequest) {
  try {
    const CACHE_KEY = "upcoming_matches";
    const CACHE_TTL = 60;

    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) {
      console.log("coming from cache upcoming_matches");
      return NextResponse.json({ success: true, data: JSON.parse(cachedData) });
    }
    const query =
      "SELECT mi.fileName FROM match_info mi JOIN ( SELECT match_id FROM matches WHERE commentary = 1 and status = 1 ORDER BY date_start_ist ASC LIMIT 10) m ON mi.match_id = m.match_id";
    const [rows] = await db.query<any[]>(query);
    if (!rows || !rows.length || rows.length === 0) {
      return NextResponse.json({ success: false, data: [] }, { status: 404 });
    }

    let allMatches: any[] = [];

    for (const row of rows) {
      const { match_id, fileName } = row;

      if (!fileName ) {
        console.warn(`File not found: ${fileName}`);
        continue; // Skip missing files
      }

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
        const parsedData = JSON.parse(fileData.toString('utf-8'));
        // ✅ Extract team info & players
        const matchInfo = parsedData || {};

        // ✅ Push structured team object into array
        allMatches.push(matchInfo);
      } catch (error) {
        console.error(`Error reading/parsing file: ${fileName}`, error);
      }
    }
    // console.log("Players:", allMatches);
    // return allMatches;
    const updatedJson = allMatches.map(obj => Object.fromEntries(Object.entries(obj).map(([k, v]) => [["live_odds","live"].includes(k) && Array.isArray(v) && v.length === 0 ? k : k, (["live_odds","live"].includes(k) && Array.isArray(v) && v.length === 0) ? {} : v])));
    if (rows.length > 0) {
      console.log("coming from api upcoming_matches");
      await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(updatedJson));
    }

    return NextResponse.json({ success: true, data: updatedJson });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
// export async function GET(req: NextRequest) {
//     try {
//         const CACHE_KEY = "upcoming_matches";
//         const CACHE_TTL = 60;

//         const cachedData = await redis.get(CACHE_KEY);
//         if (cachedData) {
//             console.log("coming from cache upcoming_matches");
//             return NextResponse.json({ success: true, data: JSON.parse(cachedData) });
//         }
//         const query = "SELECT * FROM matches WHERE status = 1 ORDER BY id DESC LIMIT 10";
//         const [rows] = await db.query<any[]>(query);

//         if (rows.length > 0) {
//             await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(rows));
//         }

//         return NextResponse.json({ success: true, data: rows });
//     } catch (error) {
//         console.error("API Error:", error);
//         return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//     }
// }
