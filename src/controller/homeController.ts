// lib/fetchMatches.ts
import { httpGet } from "@/lib/http";
import redis from "../config/redis";
import db from "../config/db";
import fs from "fs";

export async function PopularSeries() {
  const CACHE_KEY = "popularSeriesCache";
  const CACHE_TTL = 60;

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    console.log("coming from cache popularSeries");
    return JSON.parse(cachedData);
  }

  const query =
    "SELECT * FROM competitions where status != 'result' and is_popular = 1";
  const data = await db.query(query);
  const matches = data[0] || [];
  if (data.length > 0) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(matches));
  }
  console.log("coming from API popularSeries");
  return matches;
}

export async function FeaturedMatch() {
  const CACHE_KEY = "featured_matches";
  const CACHE_TTL = 60;

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    console.log("coming from cache featured_matches");
    return JSON.parse(cachedData);
  }

  const query =
    "SELECT * FROM matches where status in (1,3) and commentary= 1 and is_featured = 1";
  const data = await db.query(query);
  const matches = data[0] || [];
  if (data.length > 0) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(matches));
  }
  console.log("coming from API featured_matches");
  return matches;
}

export async function FeaturedSeries() {
  const CACHE_KEY = "featured_series";
  const CACHE_TTL = 60;

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    console.log("coming from cache featured_series");
    return JSON.parse(cachedData);
  }

  const query =
    "SELECT * FROM competitions WHERE status != 'result' and is_featured = 1";
  const data = await db.query(query);
  const matches = data[0] || [];
  if (data.length > 0) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(matches));
  }
  console.log("coming from API featured_series");
  return matches;
}

export async function upcomingMatches() {
  const CACHE_KEY = "upcoming_matches";
  const CACHE_TTL = 60;

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    console.log("coming from cache upcoming_matches");
    return JSON.parse(cachedData);
  }

  const query =
    "SELECT * FROM matches where status = 1 and commentary= 1 order by id desc limit 10";
  const data = await db.query(query);
  const matches = data[0] || [];
  if (data.length > 0) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(matches));
  }
  console.log("coming from API upcoming_matches");
  return matches;
}
export async function upcomingMatchesOld() {
  const CACHE_KEY = "upcoming_matches";
  const CACHE_TTL = 60;
  const API_URL =
    "https://rest.entitysport.com/exchange/matches?token=7b58d13da34a07b0a047e129874fdbf4&status=1&per_page=10";

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    console.log("coming from cache upcoming_matches");
    return JSON.parse(cachedData);
  }

  const data = await httpGet(API_URL);
  const matches = data?.response?.items || [];
  if (matches.length > 0) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(matches));
  }
  console.log("coming from API upcoming_matches");
  return matches;
}
export async function liveMatches() {
  const CACHE_KEY = "live_matches";
  const CACHE_TTL = 1;

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    console.log("coming from cache live_matches");
    return JSON.parse(cachedData);
  }

  const query =
    "SELECT * FROM matches where status = 3 and commentary= 1 order by domestic ASC limit 20";
  const data = await db.query(query);
  const matches = data[0] || [];

  if (data.length > 0) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(matches));
  }
  console.log("coming from API live_matches",matches);
  return matches;
}

export async function liveMatchesOld() {
  const CACHE_KEY = "live_matches";
  const CACHE_TTL = 60;
  const API_URL =
    "https://rest.entitysport.com/exchange/matches?token=7b58d13da34a07b0a047e129874fdbf4&status=3&per_page=100";

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    console.log("coming from cache live_matches");
    return JSON.parse(cachedData);
  }

  const data = await httpGet(API_URL);
  const matches = data?.response?.items || [];
  const sortedMatches = matches.sort((a: any, b: any) =>
    a.domestic === "0" ? -1 : b.domestic === "0" ? 1 : 0
  );
  if (sortedMatches.length > 0) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(sortedMatches));
  }
  console.log("coming from API live_matches");
  return sortedMatches;
}

export async function completedMatches() {
  const CACHE_KEY = "completed_matches";
  const CACHE_TTL = 60;

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    console.log("coming from cache completed matches");
    return JSON.parse(cachedData);
  }

  const query =
    "SELECT * FROM matches where status = 2 and commentary= 1 order by date_end_ist desc limit 10";
  const data = await db.query(query);
  const matches = data[0] || [];
  if (data.length > 0) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(matches));
  }
  console.log("coming from API completed_matches");
  return matches;
}

export async function completedMatchesOld() {
  const CACHE_KEY = "completed_matches";
  const CACHE_TTL = 60;
  const API_URL =
    "https://rest.entitysport.com/exchange/matches?token=7b58d13da34a07b0a047e129874fdbf4&status=2&per_page=10";

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    console.log("coming from cache completed matches");
    return JSON.parse(cachedData);
  }

  const data = await httpGet(API_URL);
  const matches = data?.response?.items || [];
  if (matches.length > 0) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(matches));
  }
  console.log("coming from API completed_matches");
  return matches;
}
export async function liveSeries() {
  const CACHE_KEY = "live_series";
  const CACHE_TTL = 60;

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    console.log("coming from cache live_series");
    return JSON.parse(cachedData);
  }

 
  const query = "SELECT * FROM competitions WHERE `status` = 'live'";
  const data = await db.query(query);
  const series = data[0] || [];

  if (data.length > 0) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(series));
  }
  // console.log("coming from API live_series");
  return series;
}

export async function liveSeriesOld() {
  const CACHE_KEY = "live_series";
  const CACHE_TTL = 60;
  const API_URL =
    "https://rest.entitysport.com/exchange/competitions?token=7b58d13da34a07b0a047e129874fdbf4&status=live&per_page=100";

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    console.log("coming from cache live_series");
    return JSON.parse(cachedData);
  }

  const data = await httpGet(API_URL);
  const series = data?.response?.items || [];
  if (series.length > 0) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(series));
  }
  // console.log("coming from API live_series");
  return series;
}

export async function seriesById(cid: number) {
  if (!cid) {
    return { notFound: true }; // Handle undefined ID gracefully
  }
  const CACHE_KEY = "series_info_" + cid;
  const CACHE_TTL = 600;

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    // console.log("coming from cache live_series");
    return JSON.parse(cachedData);
  }


  const [rows]: [any[], any] = await db.execute(
    "SELECT * FROM competition_info WHERE cid = ?",
    [cid]
  );

  if (!rows || rows.length === 0) {
    return null;
  }
  const filePath = rows[0].fileName;
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return null;
    }

    const competition = fs.readFileSync(filePath, "utf8");

    if (competition.length > 0) {
      await redis.setex(CACHE_KEY, CACHE_TTL, competition);
    }
    return JSON.parse(competition);
  } catch (error) {
    console.error(`Error reading match data:`, error);
    return null;
  }
}
export async function seriesByIdOld(cid: number) {
  if (!cid) {
    return { notFound: true }; // Handle undefined ID gracefully
  }
  const CACHE_KEY = "series_info";
  const CACHE_TTL = 600;
  const API_URL =
    "https://rest.entitysport.com/exchange/competitions/" +
    cid +
    "/info?token=7b58d13da34a07b0a047e129874fdbf4";

  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    // console.log("coming from cache live_series");
    return JSON.parse(cachedData);
  }

  const data = await httpGet(API_URL);
  const series = data?.response || [];
  if (series.length > 0) {
    await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(series));
  }
  // console.log("coming from API live_series");
  return series;
}

export async function AllSeriesList() {
  const CACHE_KEY = "tournamentsListCache";
  const CACHE_TTL = 60;

  // Check Redis cache
  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const query = "SELECT * FROM competitions WHERE `season` = 2025";
  const data = await db.query(query);
  const combinedTournaments = data[0] || [];

  // console.log("ss",combinedTournaments);
  // Store in Redis cache
  if (data.length > 0) {
    await redis.setex(
      CACHE_KEY,
      CACHE_TTL,
      JSON.stringify(combinedTournaments)
    );
  }

  return combinedTournaments;
}

export async function AllSeriesListOld() {
  const CACHE_KEY = "tournamentsListCache";
  const CACHE_TTL = 60;

  const API_URL_FIXTURE =
    "https://rest.entitysport.com/exchange/competitions?token=7b58d13da34a07b0a047e129874fdbf4&status=fixture&per_page=100";
  const API_URL_RESULT =
    "https://rest.entitysport.com/exchange/competitions?token=7b58d13da34a07b0a047e129874fdbf4&status=result&per_page=100";
  const API_URL_LIVE =
    "https://rest.entitysport.com/exchange/competitions?token=7b58d13da34a07b0a047e129874fdbf4&status=live&per_page=100";

  // Check Redis cache
  const cachedData = await redis.get(CACHE_KEY);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // Fetch data from both URLs simultaneously
  const [fixtureData, resultData, liveData] = await Promise.all([
    httpGet(API_URL_FIXTURE),
    httpGet(API_URL_RESULT),
    httpGet(API_URL_LIVE),
  ]);

  // Extract items from responses
  const tournamentsFixture = fixtureData?.response?.items || [];
  const tournamentsResult = resultData?.response?.items || [];
  const tournamentsLive = liveData?.response?.items || [];

  // Combine both datasets
  const combinedTournaments = [
    ...tournamentsFixture,
    ...tournamentsResult,
    ...tournamentsLive,
  ];
  // console.log("ss",combinedTournaments);
  // Store in Redis cache
  if (combinedTournaments.length > 0) {
    await redis.setex(
      CACHE_KEY,
      CACHE_TTL,
      JSON.stringify(combinedTournaments)
    );
  }

  return combinedTournaments;
}

export async function GetCountryCompitition() {
  try {
    // Execute the optimized SQL query
    const [rows] = await db.execute(`
          SELECT 
    co.country_name,  
    co.country_code,  
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'cid', c.cid,
            'title', c.title,
            'abbr', c.abbr,
            'category', c.category,
            'status', c.status,
            'game_format', c.game_format,
            'season', c.season,
            'datestart', c.datestart,
            'dateend', c.dateend,
            'total_matches', c.total_matches
        )
    ) AS competitions 
FROM (
    SELECT 
        c.cid, c.title, c.abbr, c.category, c.status, c.game_format, 
        c.season, c.datestart, c.dateend, c.total_matches, c.country
    FROM competitions c
    WHERE c.category = 'domestic' AND c.season = 2025
) c 
INNER JOIN countries co ON c.country = co.country_code  
GROUP BY co.country_name, co.country_code;
      `);

    // console.log(rows);
    return rows;
  } catch (error) {
    console.error("Database error:", error);
    // return res.status(500).json({ error: "Internal Server Error" });
  }
}
