import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db"; // Ensure correct import path for DB
import redis from "@/config/redis"; // Ensure correct import path for
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    // Extract `cid` from request body
    const body = await req.json();
    const { cid } = body;
    const { statType } = body;
    
    if (!cid || !statType) {
      return NextResponse.json({ error: "cid and statType is required" }, { status: 400 });
    }

    const CACHE_KEY = "match_stats_"+cid+"_"+statType;
    const CACHE_TTL = 60;

    // Check Redis cache first
    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) {
      return NextResponse.json({ success: true, data: JSON.parse(cachedData) });
    }

    // Fetch from database
    const [rows]: [any[], any]  = await db.execute('SELECT * FROM competition_stats WHERE cid = ? and statsName =?',[cid, statType]);
 

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Competition not found" },
        { status: 404 }
      );
    }

    const filePath = rows[0].fileName;

    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const competition = fs.readFileSync(filePath, "utf8");

    // Store in Redis cache
    if (competition.length > 0) {
      await redis.setex(CACHE_KEY, CACHE_TTL, competition);
    }

    return NextResponse.json({ success: true, data: JSON.parse(competition) });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
