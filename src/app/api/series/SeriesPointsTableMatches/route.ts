import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db"; // Ensure correct import path for DB
import redis from "@/config/redis"; // Ensure correct import path for
import fs from "fs";
import getJsonFromS3 from '@/lib/s3-utils';
import {createGzipResponse} from "@/utils/zlibCompress";

export async function POST(req: NextRequest) {
  try {
    // Extract `cid` from request body
    const body = await req.json();
    const { cid } = body;
    
    if (!cid) {
      return NextResponse.json({ error: "cid is required" }, { status: 400 });
    }

    const CACHE_KEY = "seriesPointsTableMatchesCache"+cid;
    const CACHE_TTL = 60;

    // Check Redis cache first
    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) {
      return createGzipResponse({ success: true, data: JSON.parse(cachedData) });
    }
    
    // Fetch from database
    const [rows]: [any[], any]  = await db.execute('SELECT * FROM competition_matches WHERE cid = ?',[cid]);
    // const [rows]: [any[], any]  = await db.execute(`SELECT * FROM match_info WHERE match_id in (SELECT match_id FROM matches WHERE JSON_UNQUOTE(JSON_EXTRACT(competition, '$.cid')) = ${cid})`);

    if (rows.length === 0) {
      return createGzipResponse(
        { success: true, data: [] }
      );
    }

    const filePath = rows[0].fileName;


    const competition = await getJsonFromS3( filePath as string);

    // Store in Redis cache
    if (competition && (Array.isArray(competition) && competition.length > 0)) {
      await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(competition));
    }

    return createGzipResponse({ success: true, data: competition });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
