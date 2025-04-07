import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db"; // Ensure correct import path for DB
import redis from "@/config/redis"; // Ensure correct import path for
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    // Extract `cid` from request body
    const body = await req.json();
    const { cid } = body;

    if (!cid) {
      return NextResponse.json({ error: "cid is required" }, { status: 400 });
    }

    const CACHE_KEY = "seriesKeyCache" + cid;
    const CACHE_TTL = 60;

    // Check Redis cache first
    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) {
      return NextResponse.json({ success: true, data: JSON.parse(cachedData) });
    }

    // Fetch from database
    const [rows]: [any[], any] = await db.execute(
      `SELECT statsName, fileName FROM competition_stats 
         WHERE cid = ? AND statsName IN (?, ?, ?, ?)`,
      [
        cid,
        "batting_most_runs",
        "batting_highest_strikerate",
        "bowling_top_wicket_takers",
        "bowling_best_bowling_figures",
      ]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Competition not found" },
        { status: 404 }
      );
    }

    const fileMap: { [key: string]: string } = {};
    rows.forEach((row) => (fileMap[row.statsName] = row.fileName));

    // Function to read files safely
    const readJsonFile = (filePath: string | undefined) => {
      if (!filePath || !fs.existsSync(filePath)) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
      try {
        return JSON.parse(fs.readFileSync(filePath, "utf8"))?.stats?.[0] || [];
      } catch (error) {
        return NextResponse.json(
          { error: "Error reading match data from" },
          { status: 404 }
        );
      }
    };

    const data = {
        mostRuns: readJsonFile(fileMap["batting_most_runs"]),
        highStrike: readJsonFile(fileMap["batting_highest_strikerate"]),
        topWickets: readJsonFile(fileMap["bowling_top_wicket_takers"]),
        bestBowling: readJsonFile(fileMap["bowling_best_bowling_figures"]),
      };
      
      return NextResponse.json({ success: true, data: data });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
