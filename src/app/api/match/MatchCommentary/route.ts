import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db"; // Ensure correct import path for DB
import redis from "@/config/redis"; // Ensure correct import path for
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    // Extract `cid` from request body
    const body = await req.json();
    const { matchid } = body;
    const { inningNumer } = body;
    
    if (!matchid || !inningNumer) {
      return NextResponse.json({ error: "matchid and inningNumer is required" }, { status: 400 });
    }

    const CACHE_KEY = "match_commentary_"+matchid+"_"+inningNumer;
    const CACHE_TTL = 60;

    // Check Redis cache first
    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) {
      return NextResponse.json({ success: true, data: JSON.parse(cachedData) });
    }

    // Fetch from database
    const [rows]: [any[], any]  = await db.execute('SELECT * FROM match_commentary WHERE match_id = ? and innings = ?',[matchid, inningNumer]);
    

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "commentary not found" },
        { status: 404 }
      );
    }

    const filePath = rows[0].fileName;

    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const commentary = fs.readFileSync(filePath, "utf8");

    // Store in Redis cache
    if (commentary.length > 0) {
      await redis.setex(CACHE_KEY, CACHE_TTL, commentary);
    }

    return NextResponse.json({ success: true, data: JSON.parse(commentary) });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
