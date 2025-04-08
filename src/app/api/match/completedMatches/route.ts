import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";
import redis from "@/config/redis";
import getJsonFromS3 from '@/lib/s3-utils';

const BUCKET_NAME = 'uc-application';

export async function GET(req: NextRequest) {
  try {
    const CACHE_KEY = "completed_matches";
    const CACHE_TTL = 60;

    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) {
      console.log("coming from cache completed matches");
      return NextResponse.json({ success: true, data: JSON.parse(cachedData) });
    }

    const query =
      "SELECT mi.fileName FROM match_info mi JOIN ( SELECT match_id FROM matches WHERE commentary = 1 and status = 2 ORDER BY date_end_ist DESC LIMIT 10) m ON mi.match_id = m.match_id";
    const [rows] = await db.query<any[]>(query);

    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: false, data: [] }, { status: 404 });
    }

    let allMatches: any[] = [];

    // Get the file path from the database query
    for (const row of rows) {
      const { match_id, fileName } = row;

    
    if (!fileName) {
      return NextResponse.json({ error: "File not found in database" }, { status: 404 });
    }
    console.log('Fetching file from S3:', fileName);  // Log fileName to debug
    try {
      const parsedData = await getJsonFromS3( fileName as string);
    const matchInfo = parsedData || {};

        // ✅ Push structured team object into array
        allMatches.push(matchInfo);
      } catch (error) {
        console.error(`Error reading/parsing file: ${fileName}`, error);
      }


  } 
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
