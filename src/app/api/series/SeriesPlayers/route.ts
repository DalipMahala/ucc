import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db"; // Ensure correct import path for DB
import redis from "@/config/redis"; 
import { TeamPlayers } from "@/controller/teamController";
import { seriesById} from "@/controller/homeController";

export async function POST(req: NextRequest) {
  try {
    // Extract `cid` from request body
    const body = await req.json();
    const { cid } = body;
    
    if (!cid) {
      return NextResponse.json({ error: "cid is required" }, { status: 400 });
    }

    const CACHE_KEY = "seriesTeamPlayersCache"+cid;
    const CACHE_TTL = 60;

    // Check Redis cache first
    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) {
      return NextResponse.json({ success: true, data: JSON.parse(cachedData) });
    }

    const SeriesDetails = await seriesById(cid);
    const teamIds = SeriesDetails?.teams?.map((series: any) => series.tid) || [];
    const teamPlayers =  await TeamPlayers(teamIds);
    const seriesFormat = SeriesDetails?.game_format;
    const uniqueFormats: any[] = [...new Set(SeriesDetails?.rounds.map((round:any) => round.match_format))];
  
   

    const teamplayerData: Record<string, any[]> = {};

    teamPlayers?.forEach((player) => {
      const teamName = player.team?.title || player.team;
      
      if (!teamplayerData[teamName]) {
        // Initialize with team info
        teamplayerData[teamName] = [player.team];
        
        // Add players for each available format
        uniqueFormats.forEach(format => {
          if (player.players?.[format]) {
            teamplayerData[teamName].push(player.players[format]);
          }
        });
      }
    });
  
    
    if (teamPlayers.length === 0) {
      return NextResponse.json(
        { success: true, data: [] }
      );
    }


    
    // Store in Redis cache
    if (teamplayerData && (Array.isArray(teamplayerData) && teamplayerData.length > 0)) {
      await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(teamplayerData));
    }

    return NextResponse.json({ success: true, data: teamplayerData });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
