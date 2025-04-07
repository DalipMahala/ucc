import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db"; // Ensure correct import path for DB
import redis from "@/config/redis"; // Ensure correct import path for
import fs from "fs";

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
      "SELECT * FROM match_info WHERE match_id = ?",[matchid]
    );
 

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
    let jsonArray = JSON.parse(`[${competition}]`)
      // Now parse it
      if (Array.isArray(jsonArray.live_odds) && jsonArray.live_odds.length === 0) {
        jsonArray.live_odds = {};
      }


    return NextResponse.json({ success: true, data: jsonArray});
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
