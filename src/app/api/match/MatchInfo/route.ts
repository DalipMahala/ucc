import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db"; // Ensure correct import path for DB
import redis from "@/config/redis"; // Ensure correct import path for
import fs from "fs";
import getJsonFromS3 from '@/lib/s3-utils';

export async function POST(req: NextRequest) {
  try {
    // Extract `cid` from request body
    const body = await req.json();
    const { matchid } = body;

    if (!matchid) {
      return NextResponse.json({ error: "matchid is required" }, { status: 400 });
    }

       // Fetch from database
    const [rows]: [any[], any] = await db.execute(
      "SELECT fileName, ball_event FROM match_info WHERE match_id = ?",[matchid]
    );
 

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Competition not found" },
        { status: 404 }
      );
    }

    const { fileName, ball_event } = rows[0];

    const jsonArray = await getJsonFromS3( fileName as string);


      if (Array.isArray(jsonArray.live_odds) && jsonArray.live_odds.length === 0) {
        jsonArray.live_odds = {};
      }

      
    const responseData = {
      ...jsonArray,
      ball_event: ball_event
    };

    return NextResponse.json({ success: true, data: responseData});
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
