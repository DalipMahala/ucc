// lib/fetchMatches.ts
import { httpGet } from "@/lib/http";
import redis from "../config/redis";
import db from "../config/db";

export async function H2hDetails(tableName: string,teama:number,teamb:number) {
    if (!tableName) {
      return { notFound: true }; // Handle undefined ID gracefully
    }

    const CACHE_KEY = "h2hDetails_" + teama+"vs"+teamb+"in"+tableName;
    const CACHE_TTL = 600;

    try {
        // Check Redis Cache
        const cachedData = await redis.get(CACHE_KEY);
        if (cachedData) {
            console.log("coming from cache team");
            return JSON.parse(cachedData);
        }
       
        // Fetch Data
        const [rows]: any = await db.execute('SELECT * FROM '+tableName+' WHERE (teama_id = ? AND teamb_id = ?) OR (teama_id = ? AND teamb_id = ?)', [teama,teamb,teamb,teama]);
  
        if (!rows || rows.length === 0) {
            return null; // Return notFound if no data found
        }
  
        const teamProfile = rows[0]; // Access first row

        if (rows.length > 0) {
            await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(teamProfile));
            console.log("coming from api team");
          }

        return teamProfile;

    } catch (error) {
        console.error("Error fetching team details:", error);
        return { error: "Failed to fetch team details" };
    }
}

export async function getTeamId(teamName:string) {
  const lowerName = teamName.toLowerCase();
    const [rows]:any = await db.query('SELECT tid FROM teams WHERE LOWER(title) = ? LIMIT 1',[lowerName]);
    return rows[0]?.tid ?? 0;
}
