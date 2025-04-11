
import { 
  InsertAllMatches, 
  InsertOrUpdateMatches, 
  MatchInfo, 
  MatchStatistics, 
  MatchCommentary, 
  Last10MatchData, 
  InsertOrUpdateLiveCompetitions, 
  InsertOrUpdateUpcomingCompetitions, 
  InsertOrUpdateCompletedCompetitions,
  CompetitionInfo, 
  CompetitionsStats, 
  CompetitionMatches, 
  InsertOrUpdateTeams, 
  TeamPlayersData, 
  TeamMatches, 
  InsertOrUpdatePlayers ,
  MatchCommentaryCompleted,
  MatchStatisticsCompleted
} from "@/controller/cronController"; // Import from cron file
import { NextRequest, NextResponse } from "next/server";


const functions: Record<string, any> = {
  "InsertAllMatches": InsertAllMatches,
  "InsertOrUpdateMatches": InsertOrUpdateMatches,
  "MatchInfo": MatchInfo,
  "MatchStatistics": MatchStatistics,
  "MatchCommentary": MatchCommentary,
  "Last10MatchData": Last10MatchData,
  "InsertOrUpdateLiveCompetitions": InsertOrUpdateLiveCompetitions,
  "InsertOrUpdateUpcomingCompetitions": InsertOrUpdateUpcomingCompetitions,
  "InsertOrUpdateCompletedCompetitions": InsertOrUpdateCompletedCompetitions,
  "CompetitionInfo": CompetitionInfo,
  "CompetitionsStats": CompetitionsStats,
  "CompetitionMatches": CompetitionMatches,
  "InsertOrUpdateTeams": InsertOrUpdateTeams,
  "TeamPlayersData": TeamPlayersData,
  "TeamMatches": TeamMatches,
  "InsertOrUpdatePlayers": InsertOrUpdatePlayers,
  "MatchCommentaryCompleted": MatchCommentaryCompleted,
  "MatchStatisticsCompleted":MatchStatisticsCompleted,
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const functionName = searchParams.get("job");
  
  if (!functionName || !functions[functionName]) {
    return NextResponse.json({ error: "Invalid function name" }, { status: 400 });
  }

  try {
    const response = await functions[functionName](); // Call function
    return NextResponse.json({ success: `Function ${functionName} executed`, data: response });
  } catch (error) {
    return NextResponse.json({ error: `Error running function: ${error}` }, { status: 500 });
  }
}