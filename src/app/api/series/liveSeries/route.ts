import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";  // Ensure correct import path for DB
import redis from "@/config/redis"; // Ensure correct import path for
import {createGzipResponse} from "@/utils/zlibCompress";

export async function GET(req: NextRequest) {
    try {
        const CACHE_KEY = "live_series";
        const CACHE_TTL = 60;
        
        const cachedData = await redis.get(CACHE_KEY);
        if (cachedData) {
            return createGzipResponse({ success: true, data: JSON.parse(cachedData) });
        }
        const query = 'SELECT * FROM competitions WHERE `status` = "live"'; 
        const [rows] = await db.query<any[]>(query);
  

        if (rows.length > 0) {
            await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(rows));
        }

        return createGzipResponse({ success: true, data: rows });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
