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

    const CACHE_KEY = "seriesStatsCache" + cid;
    const CACHE_TTL = 60;

    // Check Redis cache first
    // const cachedData = await redis.get(CACHE_KEY);
    // if (cachedData) {
    //   return NextResponse.json({ success: true, data: JSON.parse(cachedData) });
    // }

    // Fetch from database
    const [rows]: [any[], any] = await db.execute(
      `SELECT statsName, fileName FROM competition_stats 
         WHERE cid = ? AND statsName IN (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cid,
        "batting_most_runs",
        "batting_highest_average",
        "batting_highest_strikerate",
        "batting_most_run100",
        "batting_most_run50",
        "batting_most_run4",
        "batting_most_run6",
        "bowling_top_wicket_takers",
        "bowling_best_averages",
        "bowling_best_bowling_figures",
        "bowling_five_wickets",
        "bowling_best_economy_rates",
        "bowling_best_strike_rates"
      ]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Competition not found" },
        { status: 404 }
      );
    }

    const transformStatsData = (originalData: { mostrun: any; highestAverage: any; highStrike: any; most100: any; most50: any; most4: any; most6: any; topWickets: any; bowlingBestAverage: any; bestBowling: any; wiket5: any; bowlingBestEconomy: any; bowlingBestStrike: any; }) => {
        const battingStats = {
          type: "batting",
          typeData: [
            {
              key: "Most Runs",
              stats: originalData.mostrun?.stats || []
            },
            {
              key: "Highest Average",
              stats: originalData.highestAverage?.stats || []
            },
            {
              key: "Highest Strike Rate",
              stats: originalData.highStrike?.stats || []
            },
            {
              key: "Most Centuries",
              stats: originalData.most100?.stats || []
            },
            {
              key: "Most Fifties",
              stats: originalData.most50?.stats || []
            },
            {
              key: "Most Fours",
              stats: originalData.most4?.stats || []
            },
            {
              key: "Most Sixes",
              stats: originalData.most6?.stats || []
            }
          ]
        };
      
        const bowlingStats = {
          type: "bowling",
          typeData: [
            {
              key: "Most Wickets",
              stats: originalData.topWickets?.stats || []
            },
            {
              key: "Best Bowling Average",
              stats: originalData.bowlingBestAverage?.stats || []
            },
            {
              key: "Best Bowling Figures",
              stats: originalData.bestBowling?.stats || []
            },
            {
              key: "Five Wicket Hauls",
              stats: originalData.wiket5?.stats || []
            },
            {
              key: "Best Economy Rate",
              stats: originalData.bowlingBestEconomy?.stats || []
            },
            {
              key: "Best Strike Rate",
              stats: originalData.bowlingBestStrike?.stats || []
            }
          ]
        };
      
        return [battingStats, bowlingStats];
      };

    const fileMap: { [key: string]: string } = {};
    rows.forEach((row) => (fileMap[row.statsName] = row.fileName));


  
    const data = {
        mostrun: await getJsonFromS3(fileMap["batting_most_runs"]),
        highestAverage: await getJsonFromS3(fileMap["batting_highest_average"]),
        highStrike: await getJsonFromS3(fileMap["batting_highest_strikerate"]),
        most100: await getJsonFromS3(fileMap["batting_most_run100"]),
        most50: await getJsonFromS3(fileMap["batting_most_run50"]),
        most4: await getJsonFromS3(fileMap["batting_most_run4"]),
        most6: await getJsonFromS3(fileMap["batting_most_run6"]),
        topWickets: await getJsonFromS3(fileMap["bowling_top_wicket_takers"]),
        bowlingBestAverage: await getJsonFromS3(fileMap["bowling_best_averages"]),
        bestBowling: await getJsonFromS3(fileMap["bowling_best_bowling_figures"]),
        wiket5: await getJsonFromS3(fileMap["bowling_five_wickets"]),
        bowlingBestEconomy: await getJsonFromS3(fileMap["bowling_best_economy_rates"]),
        bowlingBestStrike: await getJsonFromS3(fileMap["bowling_best_strike_rates"]),
      };
      
    const transformedData = transformStatsData(data);
    // finalData.push(['type: batsman',`typeData:`+...data.mostrun.stats] );
      if (data && (Array.isArray(data) && data.length > 0)) {
        await redis.setex(CACHE_KEY, CACHE_TTL, JSON.stringify(data));
      }
      return NextResponse.json({ success: true, data: transformedData });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
