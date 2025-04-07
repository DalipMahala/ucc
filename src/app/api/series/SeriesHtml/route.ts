import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db"; // Ensure correct import path for DB
import redis from "@/config/redis"; // Ensure correct import path for

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { cid } = body;

        if (!cid) {
            return NextResponse.json({ error: "cid is required" }, { status: 400 });
          }
        const CACHE_KEY = "seriesHtml_"+cid;
        const CACHE_TTL = 60;
        
        const cachedData = await redis.get(CACHE_KEY);
        if (cachedData) {
            return NextResponse.json({ success: true, data: JSON.parse(cachedData) });
        }
        const query = 'SELECT * FROM competitions WHERE cid = ?'; 
        const [rows] = await db.query<any[]>(query,[cid]);
        

        if (rows.length > 0) {
            await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(rows));
        }

        return NextResponse.json({ success: true, data: rows });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
