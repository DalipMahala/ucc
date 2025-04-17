import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";
import redis from "@/config/redis";
import getJsonFromS3 from '@/lib/s3-utils';

const BUCKET_NAME = 'uc-application';

export async function POST(req: NextRequest) {
    try {
      // Extract `cid` from request body
      const body = await req.json();
      const { filter } = body;

    const CACHE_KEY = "fixtures_matches_"+filter;
    const CACHE_TTL = 60;

    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) {
      console.log("coming from cache fixtures matches");
      return NextResponse.json({ success: true, data: JSON.parse(cachedData) });
    }
    let query = '';
    if(filter === ''){
        query =
        "SELECT * FROM matches WHERE commentary = 1 and DATE(date_end_ist) BETWEEN DATE(NOW() - INTERVAL 45 DAY) AND DATE(NOW() + INTERVAL 60 DAY)";
    }else if(filter === '1'){
        query =
        "SELECT * FROM matches WHERE commentary = 1 and domestic = 1 and DATE(date_end_ist) BETWEEN DATE(NOW() - INTERVAL 45 DAY) AND DATE(NOW() + INTERVAL 60 DAY)";
    }else if(filter === '2'){
        query =
        "SELECT * FROM matches WHERE commentary = 1 and domestic = 2 and DATE(date_end_ist) BETWEEN DATE(NOW() - INTERVAL 45 DAY) AND DATE(NOW() + INTERVAL 60 DAY)";
    }else if(filter.toLowerCase() === 't20'){
        query =
        "SELECT * FROM matches WHERE commentary = 1 and LOWER(format_str) = 't20' and DATE(date_end_ist) BETWEEN DATE(NOW() - INTERVAL 45 DAY) AND DATE(NOW() + INTERVAL 60 DAY)";
    }else if(filter.toLowerCase() === 'test'){
        query =
        "SELECT * FROM matches WHERE commentary = 1 and LOWER(format_str) = 'test' and DATE(date_end_ist) BETWEEN DATE(NOW() - INTERVAL 45 DAY) AND DATE(NOW() + INTERVAL 60 DAY)";
    }
    else if(filter.toLowerCase() === 'odi'){
        query =
        "SELECT * FROM matches WHERE commentary = 1 and LOWER(format_str) = 'odi' and DATE(date_end_ist) BETWEEN DATE(NOW() - INTERVAL 45 DAY) AND DATE(NOW() + INTERVAL 60 DAY)";
    }else if(filter.toLowerCase() === 't20i'){
        query =
        "SELECT * FROM matches WHERE commentary = 1 and LOWER(format_str) = 't20i' and DATE(date_end_ist) BETWEEN DATE(NOW() - INTERVAL 45 DAY) AND DATE(NOW() + INTERVAL 60 DAY)";
    }else{
        query =
        "SELECT * FROM matches WHERE commentary = 1 and DATE(date_end_ist) BETWEEN DATE(NOW() - INTERVAL 45 DAY) AND DATE(NOW() + INTERVAL 60 DAY)";
    }
    
    const [rows] = await db.query<any[]>(query);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, data: [] }, { status: 404 });
    }

    let allMatches: any[] = rows;

 
  const updatedJson = allMatches.map(obj => Object.fromEntries(Object.entries(obj).map(([k, v]) => [["live_odds"].includes(k) && Array.isArray(v) && v.length === 0 ? k : k, (["live_odds"].includes(k) && Array.isArray(v) && v.length === 0) ? {} : v])));
  if (rows.length > 0) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(updatedJson));
  }
  return NextResponse.json({ success: true, data: updatedJson });
}catch (error) {
    console.error("API Error:", error);

    if (error instanceof Error) {
      console.error("Error message:", error.message);  // Log the error message for more detail
    }

    return NextResponse.json(
      { error: "Internal Server Errors" },
      { status: 500 }
    );
  }
}
