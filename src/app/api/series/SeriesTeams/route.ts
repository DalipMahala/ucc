import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db"; // Ensure correct import path for DB
import redis from "@/config/redis"; 
import { seriesById} from "@/controller/homeController";

export async function POST(req: NextRequest) {
  try {
    // Extract `cid` from request body
    const body = await req.json();
    const { cid } = body;
    
    if (!cid) {
      return NextResponse.json({ error: "cid is required" }, { status: 400 });
    }

    const CACHE_KEY = "seriesTeamsCache"+cid;
    const CACHE_TTL = 60;

    // Check Redis cache first
    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) {
      return NextResponse.json({ success: true, data: JSON.parse(cachedData) });
    }

    const SeriesDetails = await seriesById(cid);
    const teams = SeriesDetails?.teams || [];

  
    
    if (teams.length === 0) {
      return NextResponse.json(
        { success: true, data: [] }
      );
    }


    
    // Store in Redis cache
    if (teams && (Array.isArray(teams) && teams.length > 0)) {
      await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(teams));
    }

    return NextResponse.json({ success: true, data: teams });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
