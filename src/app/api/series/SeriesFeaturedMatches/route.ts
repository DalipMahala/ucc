import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db"; // Ensure correct import path for DB
import redis from "@/config/redis"; // Ensure correct import path for
import fs from "fs";
import getJsonFromS3 from '@/lib/s3-utils';

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
      return NextResponse.json({ success: true, data: JSON.parse(cachedData) });
    }

    // Fetch from database
    const [rows]: [any[], any]  = await db.execute('SELECT * FROM competition_matches WHERE cid = ?',[cid]);

    if (rows.length === 0) {
      return NextResponse.json(
        { success: true, data: [] }
      );
    }

    const filePath = rows[0].fileName;


    const competition = await getJsonFromS3( filePath as string);
    let featureSeries = competition?.items;

    let completedMatch = featureSeries?.filter(
        (item: { status: number }) => Number(item.status) === 2
      );  
      completedMatch = [...completedMatch]?.reverse();
      let upcomingMatch = featureSeries.filter(
        (item: { status: number }) => Number(item.status) === 1
      );
      let liveMatch = featureSeries.filter(
        (item: { status: number }) => Number(item.status) === 3
      );

      let selectedMatches = [];

        if (
            liveMatch.length > 0 &&
            completedMatch.length > 0 &&
            upcomingMatch.length > 0
        ) {
            selectedMatches = [
            ...liveMatch.slice(0, 1),
            ...completedMatch.slice(0, 1),
            ...upcomingMatch.slice(0, 1),
            ];
        }
        else if (
            liveMatch.length === 0 &&
            completedMatch.length > 0 &&
            upcomingMatch.length > 0
        ) {
            selectedMatches = [
            ...completedMatch.slice(0, 1),
            ...upcomingMatch.slice(0, 2),
            ];
        }
        else if (
            liveMatch.length === 0 &&
            completedMatch.length === 0 &&
            upcomingMatch.length > 0
        ) {
            selectedMatches = upcomingMatch.slice(0, 3);
        }
        else {
            if (liveMatch.length > 0) {
            selectedMatches = liveMatch.slice(0, 3);
            } else if (completedMatch.length > 0) {
            selectedMatches = completedMatch.slice(0, 3);
            } else if (upcomingMatch.length > 0) {
            selectedMatches = upcomingMatch.slice(0, 3);
            }
        }

    
    // Store in Redis cache
    if (selectedMatches && (Array.isArray(selectedMatches) && selectedMatches.length > 0)) {
      await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(selectedMatches));
    }

    return NextResponse.json({ success: true, data: selectedMatches });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
