
import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";
import redis from "@/config/redis";
import { RowDataPacket } from "mysql2";

const ITEMS_PER_PAGE = 20;

interface MatchRecord extends RowDataPacket {
  // Define your match record fields here
  id: number;
  commentary: number;
  date_end_ist: string;
  // Add other fields as needed
}

interface CountResult extends RowDataPacket {
  total: number;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filter, page = 1 } = body;
    const offset = (page - 1) * ITEMS_PER_PAGE;

    const CACHE_KEY = `fixtures_matches_${filter}_page_${page}`;
    const CACHE_TTL = 1;

    const cachedData = await redis.get(CACHE_KEY);
    if (cachedData) {
      console.log("Returning cached fixtures matches");
      return NextResponse.json({ 
        success: true, 
        data: JSON.parse(cachedData) 
      });
    }

    let baseQuery = '';
    if(filter === ''){
        baseQuery =
        "SELECT * FROM matches WHERE commentary = 1 and DATE(date_end_ist) BETWEEN DATE(NOW() - INTERVAL 45 DAY) AND DATE(NOW() + INTERVAL 60 DAY)";
    }else if(filter === '1'){
        baseQuery =
        "SELECT * FROM matches WHERE commentary = 1 and domestic = 1 and DATE(date_end_ist) BETWEEN DATE(NOW() - INTERVAL 45 DAY) AND DATE(NOW() + INTERVAL 60 DAY)";
    }else if(filter === '2'){
        baseQuery =
        "SELECT * FROM matches WHERE commentary = 1 and domestic = 2 and DATE(date_end_ist) BETWEEN DATE(NOW() - INTERVAL 45 DAY) AND DATE(NOW() + INTERVAL 60 DAY)";
    }else if(filter.toLowerCase() === 't20'){
        baseQuery =
        "SELECT * FROM matches WHERE commentary = 1 and LOWER(format_str) = 't20' and DATE(date_end_ist) BETWEEN DATE(NOW() - INTERVAL 45 DAY) AND DATE(NOW() + INTERVAL 60 DAY)";
    }else if(filter.toLowerCase() === 'test'){
        baseQuery =
        "SELECT * FROM matches WHERE commentary = 1 and LOWER(format_str) = 'test' and DATE(date_end_ist) BETWEEN DATE(NOW() - INTERVAL 45 DAY) AND DATE(NOW() + INTERVAL 60 DAY)";
    }
    else if(filter.toLowerCase() === 'odi'){
        baseQuery =
        "SELECT * FROM matches WHERE commentary = 1 and LOWER(format_str) = 'odi' and DATE(date_end_ist) BETWEEN DATE(NOW() - INTERVAL 45 DAY) AND DATE(NOW() + INTERVAL 60 DAY)";
    }else if(filter.toLowerCase() === 't20i'){
        baseQuery =
        "SELECT * FROM matches WHERE commentary = 1 and LOWER(format_str) = 't20i' and DATE(date_end_ist) BETWEEN DATE(NOW() - INTERVAL 45 DAY) AND DATE(NOW() + INTERVAL 60 DAY)";
    }else{
        baseQuery =
        "SELECT * FROM matches WHERE commentary = 1 and DATE(date_end_ist) BETWEEN DATE(NOW() - INTERVAL 45 DAY) AND DATE(NOW() + INTERVAL 60 DAY)";
    }
    
    const [countRows] = await db.query<CountResult[]>(
        `SELECT COUNT(*) as total FROM (${baseQuery}) as count_query`
      );
      const total = countRows[0]?.total || 0;
  
      // Get paginated data
      const [rows] = await db.query<MatchRecord[]>(
        `${baseQuery} LIMIT ? OFFSET ?`,
        [ITEMS_PER_PAGE, offset]
      );
  
      if (!rows || rows.length === 0) {
        return NextResponse.json({ 
          success: false, 
          data: [] 
        }, { status: 404 });
      }
  
      // Process the data (your existing transformation logic)
      const updatedJson = rows.map(obj => ({
        ...obj,
        live_odds: Array.isArray(obj.live_odds) && obj.live_odds.length === 0 ? {} : obj.live_odds
      }));
  
      if (rows.length > 0) {
        await redis.setex(
          CACHE_KEY, 
          CACHE_TTL, 
          JSON.stringify(updatedJson)
        );
      }
  
      return NextResponse.json({
        success: true,
        data: updatedJson,
        pagination: {
          totalItems: total,
          itemsPerPage: ITEMS_PER_PAGE,
          currentPage: page,
          totalPages: Math.ceil(total / ITEMS_PER_PAGE)
        }
      });
  
    } catch (error) {
      console.error("API Error:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
