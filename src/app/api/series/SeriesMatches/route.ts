import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";
import redis from "@/config/redis";
import getJsonFromS3 from '@/lib/s3-utils';

const BUCKET_NAME = 'uc-application';

interface MatchItem {
    game_state_str: string;
    man_of_the_match: any;
    live_odds: any;
    man_of_the_match_pname: string;
    match_number: string;
    commentary: number;
    live: string;
    match_id: number;
    status_str: string;
    competition: {
      total_teams: number;
      cid: string;
      title: string;
      season: string;
    };
    teama: {
      name: string;
      short_name: string;
      logo_url: string;
      scores?: string;
      overs?: string;
      team_id?: string;
    };
    teamb: {
      name: string;
      short_name: string;
      logo_url: string;
      scores?: string;
      overs?: string;
      team_id?: string;
    };
    subtitle: string;
    format_str: string;
    venue: {
      name: string;
      location: string;
    };
    status_note: string;
    result: string;
    date_start_ist: string;
    match_info: any;
  }
export async function POST(req: NextRequest) {
    try {
      // Extract `cid` from request body
      const body = await req.json();
      const { cid } = body;
      
      if (!cid) {
        return NextResponse.json({ error: "cid is required" }, { status: 400 });
      }

    const CACHE_KEY = "series_matches_"+cid;
    const CACHE_TTL = 60;

    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) {
      // console.log("coming from cache series matches");
      return NextResponse.json({ success: true, data: JSON.parse(cachedData) });
    }
    
    const query =
      `SELECT mi.fileName FROM match_info mi JOIN ( SELECT match_id FROM matches WHERE commentary = 1 and JSON_UNQUOTE(JSON_EXTRACT(competition, '$.cid')) = ${cid}) m ON mi.match_id = m.match_id`;
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
    // console.log('Fetching file from S3:', fileName);  // Log fileName to debug
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
  const futuredMatches = allMatches?.map(({ match_info, ...rest }:MatchItem) => ({
    ...match_info,
    ...rest
  }));
  if (rows.length > 0) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(futuredMatches));
  }
  return NextResponse.json({ success: true, data: futuredMatches });
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
