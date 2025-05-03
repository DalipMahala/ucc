// lib/fetchMatches.ts
import { httpGet } from "@/lib/http";
import redis from "../config/redis";
import db from "../config/db";
import fs from 'fs';
import getJsonFromS3 from '@/lib/s3-utils';

export async function isValidMatch(matchid: number,url: string) {
  if (!matchid) {
    return { notFound: true };
  }

  const [rows]  = await db.execute('SELECT match_id FROM matches WHERE match_id = ? and (match_url_full = ? or match_url_short = ?)',[matchid,url,url]);
  // const match = data[0] || [];
  
  return Array.isArray(rows) && rows.length > 0;
    
  
}

export async function getMatchUrlsByIds(matchIds: string[]): Promise<Record<string, string>> {
  if (!matchIds.length) return {};

  const placeholders = matchIds.map(() => '?').join(',');
  const [rows] = await db.execute(
    `SELECT match_id, COALESCE(match_url_short, match_url_full) AS match_url
     FROM matches WHERE match_id IN (${placeholders})`,
    matchIds
  );

  const result: Record<string, string> = {};
  if (Array.isArray(rows)) {
    for (const row of rows as any[]) {
      result[row.match_id] = row.match_url;
    }
  }

  return result;
}
export async function MatcheInfo_old(matchid: number) {
  if (!matchid) {
    return { notFound: true };
  }
  const CACHE_KEY = "match_info_by_id";
  const CACHE_TTL = 60;
  const API_URL =
    "https://rest.entitysport.com/exchange/matches/" +
    matchid +
    "/info?token=7b58d13da34a07b0a047e129874fdbf4";

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
     
    return JSON.parse(cachedData);
  }
  const data = await httpGet(API_URL);
  const matches = data?.response || [];
  if (matches.length > 0) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(matches));
  }
  return matches;
}

export async function MatcheInfo(matchid: number) {
  if (!matchid) {
    return { notFound: true };
  }
  const CACHE_KEY = "match_info_"+matchid;
  const CACHE_TTL = 60;

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    
    return JSON.parse(cachedData);
  }
  

  const [rows]: [any[], any]  = await db.execute('SELECT * FROM match_info WHERE match_id = ?',[matchid]);
  
  if (!rows || rows.length === 0) {
    return null;
  }

  const fileName =   rows[0].fileName;
  const ballEvent =   rows[0].ball_event;
  try {
    const matches = await getJsonFromS3( fileName as string);

    // Store in Redis cache
    if (matches && (Array.isArray(matches) && matches.length > 0)) {
      await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(matches));
    }
    matches["ballEvent"] = ballEvent;
      return matches;
      
      
  } catch (error) {
      console.error(`Error reading match data:`, error);
      return null;
  }
  
}
export async function Last10MatchOld(matchid: number) {
  if (!matchid) {
    return { notFound: true }; // Handle undefined ID gracefully
  }

  const CACHE_KEY = "last_10_match";
  const CACHE_TTL = 600;

  const API_URL =
    "https://rest.entitysport.com/v4/matches/" +
    matchid +
    "/advance?token=7b58d13da34a07b0a047e129874fdbf4";

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
     
    return JSON.parse(cachedData);
  }

  const data = await httpGet(API_URL);
  const matches = data?.response || [];
  if (matches.length > 0) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(matches));
  }
  return matches;
}

export async function Last10Match(matchid: number) {
  if (!matchid) {
    return { notFound: true }; // Handle undefined ID gracefully
  }

  const CACHE_KEY = "last_10_match_"+matchid;
  const CACHE_TTL = 600;

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    
    return JSON.parse(cachedData);
  }
  
 
  const [rows]: [any[], any]  = await db.execute('SELECT * FROM match_advance WHERE match_id = ?',[matchid]);
  if (!rows || rows.length === 0) {
    return null;
  }
  const fileName =   rows[0].fileName;
  try {
    const matches = await getJsonFromS3( fileName as string);

    // Store in Redis cache
    if (matches && (Array.isArray(matches) && matches.length > 0)) {
      await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(matches));
    }

      return matches;
      
      
  } catch (error) {
      console.error(`Error reading match data:`, error);
      return null;
  }
}
export async function MatchStatistics(matchid: number) {
  if (!matchid) {
    return { notFound: true }; // Handle undefined ID gracefully
  }

  const CACHE_KEY = "match_statistics_"+matchid;
  const CACHE_TTL = 60;

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
     
    return JSON.parse(cachedData);
  }


  const [rows]: [any[], any]  = await db.execute('SELECT * FROM match_statistics WHERE match_id = ?',[matchid]);
  if (!rows || rows.length === 0) {
    return null;
  }
  const fileName =   rows[0].fileName;
  try {
    const matches = await getJsonFromS3( fileName as string);

    // Store in Redis cache
    if (matches && (Array.isArray(matches) && matches.length > 0)) {
      await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(matches));
    }

      return matches;
      
  } catch (error) {
      console.error(`Error reading match data:`, error);
      return null;
  }
}

export async function MatchStatisticsOld(matchid: number) {
  if (!matchid) {
    return { notFound: true }; // Handle undefined ID gracefully
  }

  const CACHE_KEY = "match_statistics";
  const CACHE_TTL = 60;

  const API_URL =
    "https://rest.entitysport.com/exchange/matches/" +
    matchid +
    "/statistics?token=7b58d13da34a07b0a047e129874fdbf4";

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
     
    return JSON.parse(cachedData);
  }

  const data = await httpGet(API_URL);
  const matches = data?.response || [];
  if (matches.length > 0) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(matches));
  }
  return matches;
}

export async function MatchCommentary(matchid: number, inningNumer: number) {
  console.log("match", matchid);
  if (!matchid || !inningNumer) {
    return { notFound: true }; // Handle undefined ID gracefully
  }

  const CACHE_KEY = "match_commentary_"+matchid+"_"+inningNumer;
  const CACHE_TTL = 60;

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
     
    return JSON.parse(cachedData);
  }

 
  const [rows]: [any[], any]  = await db.execute('SELECT * FROM match_commentary WHERE match_id = ? and innings = ?',[matchid, inningNumer]);
  if (!rows || rows.length === 0) {
    return null;
  }
  const fileName =   rows[0].fileName;
  try {
    const matchInningCommentaries = await getJsonFromS3( fileName as string);

    // Store in Redis cache
    if (matchInningCommentaries && (Array.isArray(matchInningCommentaries) && matchInningCommentaries.length > 0)) {
      await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(matchInningCommentaries));
    }

      return matchInningCommentaries;
      
      
  } catch (error) {
      console.error(`Error reading match data:`, error);
      return null;
  }

}
export async function MatchCommentaryOld(matchid: number, inningNumer: number) {
  console.log("match", matchid);
  if (!matchid || !inningNumer) {
    return { notFound: true }; // Handle undefined ID gracefully
  }

  const CACHE_KEY = "match_commentary";
  const CACHE_TTL = 60;

  const API_URL =
    "https://rest.entitysport.com/exchange/matches/" +
    matchid +
    "/innings/" +
    inningNumer +
    "/commentary?token=7b58d13da34a07b0a047e129874fdbf4";

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
     
    return JSON.parse(cachedData);
  }

  const data = await httpGet(API_URL);
  const matchInningCommentaries = data?.response || [];

  if (matchInningCommentaries.length > 0) {
    await redis.setex(
      CACHE_KEY,
      CACHE_TTL,
      JSON.stringify(matchInningCommentaries)
    );
  }

  return matchInningCommentaries;
}

export async function MatcheStats(cid: number, statType: string) {
  if (!cid) {
    return { notFound: true }; // Handle undefined ID gracefully
  }

  const CACHE_KEY = "match_stats_"+cid+"_"+statType;
  const CACHE_TTL = 60;

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    
    return JSON.parse(cachedData);
  }
  const [rows]: [any[], any]  = await db.execute('SELECT * FROM competition_stats WHERE cid = ? and statsName =?',[cid, statType]);
  if (!rows || rows.length === 0) {
    return null;
  }
  const fileName =   rows[0].fileName;
  try {
    const matches = await getJsonFromS3( fileName as string);

    // Store in Redis cache
    if (matches && (Array.isArray(matches) && matches.length > 0)) {
      await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(matches));
    }

      return matches;
      
  } catch (error) {
      console.error(`Error reading match data:`, error);
      return null;
  }
}
export async function MatcheStatsOld(cid: number, statType: string) {
  if (!cid) {
    return { notFound: true }; // Handle undefined ID gracefully
  }

  const CACHE_KEY = "match_stats";
  const CACHE_TTL = 60;

  const API_URL =
    "https://rest.entitysport.com/exchange/competitions/" +
    cid +
    "/stats/" +
    statType +
    "?token=7b58d13da34a07b0a047e129874fdbf4";

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
     
    return JSON.parse(cachedData);
  }

  const data = await httpGet(API_URL);
  const matches = data?.response || [];

  if (matches.length > 0) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(matches));
  }

  return matches;
}

export async function SeriesPointsTable(cid: number) {
  if (!cid) {
    return { notFound: true }; // Handle undefined ID gracefully
  }

  const CACHE_KEY = "series_info_"+cid;
  const CACHE_TTL = 60;

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    
    return JSON.parse(cachedData);
  }


  const [rows]: [any[], any]  = await db.execute('SELECT * FROM competition_info WHERE cid = ?',[cid]);
  if (!rows || rows.length === 0) {
    return null;
  }
  const fileName =   rows[0].fileName;
  try {
    const competition = await getJsonFromS3( fileName as string);

    // Store in Redis cache
    if (competition && (Array.isArray(competition) && competition.length > 0)) {
      await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(competition));
    }

      return competition;
      
      
  } catch (error) {
      console.error(`Error reading match data:`, error);
      return null;
  }
}
export async function SeriesPointsTableOld(cid: number) {
  if (!cid) {
    return { notFound: true }; // Handle undefined ID gracefully
  }

  const CACHE_KEY = "seriesPointsTableCache";
  const CACHE_TTL = 60;

  const API_URL =
    "https://rest.entitysport.com/exchange/competitions/" +
    cid +
    "/info?token=7b58d13da34a07b0a047e129874fdbf4";

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
     
    return JSON.parse(cachedData);
  }

  const data = await httpGet(API_URL);
  const matches = data?.response || [];

  if (matches.length > 0) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(matches));
  }

  return matches;
}

export async function SeriesPointsTableMatches(cid: number) {
  if (!cid) {
    return { notFound: true }; // Handle undefined ID gracefully
  }

  const CACHE_KEY = "seriesPointsTableMatchesCache"+cid;
  const CACHE_TTL = 60;

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    
    return JSON.parse(cachedData);
  }


  const [rows]: [any[], any]  = await db.execute('SELECT * FROM competition_matches WHERE cid = ?',[cid]);
  if (!rows || rows.length === 0) {
    return null;
  }
  const fileName =   rows[0].fileName;
  try {
    const competition = await getJsonFromS3( fileName as string);

    // Store in Redis cache
    if (competition && (Array.isArray(competition) && competition.length > 0)) {
      await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(competition));
    }

      return competition;
      
      
  } catch (error) {
      console.error(`Error reading match data:`, error);
      return null;
  }
}

export async function SeriesPointsTableMatchesOld(cid: number) {
  if (!cid) {
    return { notFound: true }; // Handle undefined ID gracefully
  }

  const CACHE_KEY = "seriesPointsTableMatchesCache";
  const CACHE_TTL = 60;

  const API_URL =
    "https://rest.entitysport.com/exchange/competitions/" +
    cid +
    "/matches?token=7b58d13da34a07b0a047e129874fdbf4";

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
     
    return JSON.parse(cachedData);
  }

  const data = await httpGet(API_URL);
  const matches = data?.response || [];

  if (matches.length > 0) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(matches));
  }

  return matches;
}

export async function SeriesKeyStats(cid: number) {
  if (!cid) {
    return { notFound: true }; // Handle undefined ID gracefully
  }


  
  // Fetch all required stats in a single query
  const [rows]: [any[], any] = await db.execute(
    `SELECT statsName, fileName FROM competition_stats 
     WHERE cid = ? AND statsName IN (?, ?, ?, ?)`,
    [cid, "batting_most_runs", "batting_highest_strikerate", "bowling_top_wicket_takers", "bowling_best_bowling_figures"]
  );


  if (!rows || rows.length === 0) {
    return null;
  }
  // Map statsName to filenames
  const fileMap: { [key: string]: string } = {};
  rows.forEach(row => fileMap[row.statsName] = row.fileName);

  // Function to read files safely
  // const readJsonFile = (filePath: string | undefined) => {
  //   if (!filePath) {
  //     console.log(`File not found: ${filePath}`);
  //     return [];
  //   }
  //   try {
  //     return JSON.parse(fs.readFileSync(filePath, 'utf8'))?.stats?.[0] || [];
  //   } catch (error) {
  //     console.error(`Error reading match data from ${filePath}:`, error);
  //     return [];
  //   }
  // };
  
  // Read all required files
  return {
    mostRuns: await getJsonFromS3(fileMap["batting_most_runs"]),
    highStrike: await getJsonFromS3(fileMap["batting_highest_strikerate"]),
    topWickets: await getJsonFromS3(fileMap["bowling_top_wicket_takers"]),
    bestBowling: await getJsonFromS3(fileMap["bowling_best_bowling_figures"]),
  };
}

export async function SeriesKeyStatsOld(cid: number) {
  if (!cid) {
    return { notFound: true }; // Handle undefined ID gracefully
  }

  const baseUrl = "https://rest.entitysport.com/exchange/competitions";
  const token = "7b58d13da34a07b0a047e129874fdbf4";

  const endpoints = {
    mostRuns: `${baseUrl}/${cid}/stats/batting_most_runs?token=${token}`,
    highStrike: `${baseUrl}/${cid}/stats/batting_highest_strikerate?token=${token}`,
    topWickets: `${baseUrl}/${cid}/stats/bowling_top_wicket_takers?token=${token}`,
    bestBowling: `${baseUrl}/${cid}/stats/bowling_best_bowling_figures?token=${token}`,
  };

  try {
    const [mostRuns, highStrike, topWickets, bestBowling] = await Promise.all(
      Object.values(endpoints)?.map((url) => httpGet(url))
    );

    return {
      mostRuns: mostRuns?.response?.stats?.[0] || [],
      highStrike: highStrike?.response?.stats?.[0] || [],
      topWickets: topWickets?.response?.stats?.[0] || [],
      bestBowling: bestBowling?.response?.stats?.[0] || [],
    };
  } catch (error) {
    console.error("Error fetching series stats:", error);
    return { error: "Failed to fetch series stats" };
  }
}
interface Match {
  status: number;
}
export async function SeriesMatches(cid: number) {
  if (!cid) {
    return { notFound: true }; // Handle undefined ID gracefully
  }

  const CACHE_KEY = "series_matches_"+cid;
  const CACHE_TTL = 60;

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    
    return JSON.parse(cachedData);
  }


  
  // Fetch all required stats in a single query
  const [rows]: [any[], any] = await db.execute( `SELECT fileName FROM competition_matches  WHERE cid = ?`,[cid]);
  
  if (!rows || rows.length === 0) {
    return null;
  }
  
  const fileName =   rows[0].fileName;


    try {
      const competition = await getJsonFromS3( fileName as string);
      
      // const allMatches =  JSON.parse(competition);
      const allMatches: { items: Match[] } = competition;

      const categorizedMatches: {
        scheduledMatch: Match[];
        resultMatch: Match[];
        liveMatch: Match[];
      } = { scheduledMatch: [], resultMatch: [], liveMatch: [] };
      
      allMatches?.items?.forEach((match: { status: number }) => {
        if (match.status === 1) categorizedMatches.scheduledMatch.push(match);
        else if (match.status === 2) categorizedMatches.resultMatch.push(match);
        else if (match.status === 3) categorizedMatches.liveMatch.push(match);
      });

        // Store in Redis cache
  if (competition && (Array.isArray(competition) && competition.length > 0)) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(competition));
  }

      return categorizedMatches;
      
      
  } catch (error) {
      console.error(`Error reading match data:`, error);
      return null;
  }

  
}

export async function SeriesMatchesOld(cid: number) {
  if (!cid) {
    return { notFound: true }; // Handle undefined ID gracefully
  }

  const baseUrl = "https://rest.entitysport.com/exchange/competitions";
  const token = "7b58d13da34a07b0a047e129874fdbf4";

  const endpoints = {
    scheduledMatch: `${baseUrl}/${cid}/matches?token=${token}&status=1`,
    resultMatch: `${baseUrl}/${cid}/matches?token=${token}&status=2`,
    liveMatch: `${baseUrl}/${cid}/matches?token=${token}&status=3`,
  };

  try {
    const [scheduledMatch, resultMatch, liveMatch] = await Promise.all(
      Object.values(endpoints)?.map((url) => httpGet(url))
    );

    return {
      scheduledMatch: scheduledMatch?.response?.items || [],
      resultMatch: resultMatch?.response?.items || [],
      liveMatch: liveMatch?.response?.items || [],
    };
  } catch (error) {
    console.error("Error fetching series items:", error);
    return { error: "Failed to fetch series items" };
  }
}


