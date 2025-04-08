import db from "../config/db";
import { httpGet } from "../lib/http";
import pLimit from "p-limit";
import fs from "fs";
import path from "path";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from '@/lib/aws';

const BUCKET_NAME = 'uc-application';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


export async function InsertAllMatches() {
  const dynamicDateRange = `${new Date().toISOString().split("T")[0]}_${new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}`;
  
  const API_URL =
    "https://rest.entitysport.com/exchange/matches?token=7b58d13da34a07b0a047e129874fdbf4&per_page=100&date="+dynamicDateRange;
    try {
  const data = await httpGet(API_URL);
  const matches = data?.response?.items || [];
  const totalPages = data?.response?.total_pages || 0;

  if (totalPages > 1) {
    await delay(200);

    // Create an array of promises to fetch all pages in parallel
    const requests = Array.from({ length: totalPages }, (_, i) =>
      httpGet(`${API_URL}&paged=${i + 1}`)
    );

    // Fetch all pages simultaneously
    const results = await Promise.all(requests);

    // Collect all match data
    results.forEach((pagedata) => {
      matches.push(...(pagedata?.response?.items || []));
    });
  }
  if (matches.length === 0) return;
    
      const values = matches.map(
        (match: {
          match_id: any;
          title: any;
          short_title: any;
          subtitle: any;
          match_number: any;
          format: any;
          format_str: any;
          status: any;
          status_str: any;
          status_note: any;
          game_state: any;
          game_state_str: any;
          domestic: any;
          competition: any;
          teama: any;
          teamb: any;
          date_start: any;
          date_end: any;
          timestamp_start: any;
          timestamp_end: any;
          date_start_ist: any;
          date_end_ist: any;
          venue: any;
          umpires: any;
          referee: any;
          equation: any;
          live: any;
          result: any;
          result_type: any;
          win_margin: any;
          winning_team_id: any;
          commentary: any;
          wagon: any;
          latest_inning_number: any;
          oddstype: any;
          session_odds_available: any;
          weather: any;
          pitch: any;
          toss: any;
        }) => [
          match.match_id,
          match.title,
          match.short_title,
          match.subtitle,
          match.match_number,
          match.format,
          match.format_str,
          match.status,
          match.status_str,
          match.status_note,
          match.game_state,
          match.game_state_str,
          match.domestic,
          JSON.stringify(match.competition),
          JSON.stringify(match.teama),
          JSON.stringify(match.teamb),
          match.date_start,
          match.date_end,
          match.timestamp_start,
          match.timestamp_end,
          match.date_start_ist,
          match.date_end_ist,
          JSON.stringify(match.venue),
          match.umpires,
          match.referee,
          match.equation,
          match.live,
          match.result,
          match.result_type,
          match.win_margin,
          match.winning_team_id,
          match.commentary,
          match.wagon,
          match.latest_inning_number,
          match.oddstype,
          match.session_odds_available,
          JSON.stringify(match.weather),
          JSON.stringify(match.pitch),
          JSON.stringify(match.toss),
        ]
      );

      const query = `
            INSERT INTO matches ( match_id, title, short_title, subtitle, match_number, format, format_str, status, status_str, 
            status_note, game_state, game_state_str, domestic, competition, teama, teamb, date_start, 
            date_end, timestamp_start, timestamp_end, date_start_ist, date_end_ist, venue, umpires, 
            referee, equation, live, result, result_type, win_margin, winning_team_id, commentary, 
            wagon, latest_inning_number, oddstype, session_odds_available, weather, pitch, toss)
            VALUES ?
            ON DUPLICATE KEY UPDATE 
                title = VALUES(title),
          short_title = VALUES(short_title),
          subtitle = VALUES(subtitle),
          match_number = VALUES(match_number),
          format = VALUES(format),
          format_str = VALUES(format_str),
          status = VALUES(status),
          status_str = VALUES(status_str),
          status_note = VALUES(status_note),
          game_state = VALUES(game_state),
          game_state_str = VALUES(game_state_str),
          domestic = VALUES(domestic),
          competition = VALUES(competition),
          teama = VALUES(teama),
          teamb = VALUES(teamb),
          date_start = VALUES(date_start),
          date_end = VALUES(date_end),
          timestamp_start = VALUES(timestamp_start),
          timestamp_end = VALUES(timestamp_end),
          date_start_ist = VALUES(date_start_ist),
          date_end_ist = VALUES(date_end_ist),
          venue = VALUES(venue),
          umpires = VALUES(umpires),
          referee = VALUES(referee),
          equation = VALUES(equation),
          live = VALUES(live),
          result = VALUES(result),
          result_type = VALUES(result_type),
          win_margin = VALUES(win_margin),
          winning_team_id = VALUES(winning_team_id),
          commentary = VALUES(commentary),
          wagon = VALUES(wagon),
          latest_inning_number = VALUES(latest_inning_number),
          oddstype = VALUES(oddstype),
          session_odds_available = VALUES(session_odds_available),
          weather = VALUES(weather),
          pitch = VALUES(pitch),
          toss = VALUES(toss);
        `;
      // console.log("SQL Query:", query);
      // console.log("Values:", matches);
      await db.query(query, [values]);
    } catch (error) {
      console.error("Error in batch upsert:", error);
    }
  
}
export async function InsertOrUpdateMatches() {
  const dynamicDateRange = `${new Date(Date.now() - 86400000).toISOString().split("T")[0]}_${new Date(Date.now() + 86400000).toISOString().split("T")[0]}`;
  
  const API_URL =
    "https://rest.entitysport.com/exchange/matches?token=7b58d13da34a07b0a047e129874fdbf4&per_page=100&date="+dynamicDateRange;
    try {
  const data = await httpGet(API_URL);
  const matches = data?.response?.items || [];
  const totalPages = data?.response?.total_pages || 0;

  if (totalPages > 1) {
    await delay(200);

    // Create an array of promises to fetch all pages in parallel
    const requests = Array.from({ length: totalPages }, (_, i) =>
      httpGet(`${API_URL}&paged=${i + 1}`)
    );

    // Fetch all pages simultaneously
    const results = await Promise.all(requests);

    // Collect all match data
    results.forEach((pagedata) => {
      matches.push(...(pagedata?.response?.items || []));
    });
  }
  if (matches.length === 0) return;
    
      const values = matches.map(
        (match: {
          match_id: any;
          title: any;
          short_title: any;
          subtitle: any;
          match_number: any;
          format: any;
          format_str: any;
          status: any;
          status_str: any;
          status_note: any;
          game_state: any;
          game_state_str: any;
          domestic: any;
          competition: any;
          teama: any;
          teamb: any;
          date_start: any;
          date_end: any;
          timestamp_start: any;
          timestamp_end: any;
          date_start_ist: any;
          date_end_ist: any;
          venue: any;
          umpires: any;
          referee: any;
          equation: any;
          live: any;
          result: any;
          result_type: any;
          win_margin: any;
          winning_team_id: any;
          commentary: any;
          wagon: any;
          latest_inning_number: any;
          oddstype: any;
          session_odds_available: any;
          weather: any;
          pitch: any;
          toss: any;
        }) => [
          match.match_id,
          match.title,
          match.short_title,
          match.subtitle,
          match.match_number,
          match.format,
          match.format_str,
          match.status,
          match.status_str,
          match.status_note,
          match.game_state,
          match.game_state_str,
          match.domestic,
          JSON.stringify(match.competition),
          JSON.stringify(match.teama),
          JSON.stringify(match.teamb),
          match.date_start,
          match.date_end,
          match.timestamp_start,
          match.timestamp_end,
          match.date_start_ist,
          match.date_end_ist,
          JSON.stringify(match.venue),
          match.umpires,
          match.referee,
          match.equation,
          match.live,
          match.result,
          match.result_type,
          match.win_margin,
          match.winning_team_id,
          match.commentary,
          match.wagon,
          match.latest_inning_number,
          match.oddstype,
          match.session_odds_available,
          JSON.stringify(match.weather),
          JSON.stringify(match.pitch),
          JSON.stringify(match.toss),
        ]
      );

      const query = `
            INSERT INTO matches ( match_id, title, short_title, subtitle, match_number, format, format_str, status, status_str, 
            status_note, game_state, game_state_str, domestic, competition, teama, teamb, date_start, 
            date_end, timestamp_start, timestamp_end, date_start_ist, date_end_ist, venue, umpires, 
            referee, equation, live, result, result_type, win_margin, winning_team_id, commentary, 
            wagon, latest_inning_number, oddstype, session_odds_available, weather, pitch, toss)
            VALUES ?
            ON DUPLICATE KEY UPDATE 
                title = VALUES(title),
          short_title = VALUES(short_title),
          subtitle = VALUES(subtitle),
          match_number = VALUES(match_number),
          format = VALUES(format),
          format_str = VALUES(format_str),
          status = VALUES(status),
          status_str = VALUES(status_str),
          status_note = VALUES(status_note),
          game_state = VALUES(game_state),
          game_state_str = VALUES(game_state_str),
          domestic = VALUES(domestic),
          competition = VALUES(competition),
          teama = VALUES(teama),
          teamb = VALUES(teamb),
          date_start = VALUES(date_start),
          date_end = VALUES(date_end),
          timestamp_start = VALUES(timestamp_start),
          timestamp_end = VALUES(timestamp_end),
          date_start_ist = VALUES(date_start_ist),
          date_end_ist = VALUES(date_end_ist),
          venue = VALUES(venue),
          umpires = VALUES(umpires),
          referee = VALUES(referee),
          equation = VALUES(equation),
          live = VALUES(live),
          result = VALUES(result),
          result_type = VALUES(result_type),
          win_margin = VALUES(win_margin),
          winning_team_id = VALUES(winning_team_id),
          commentary = VALUES(commentary),
          wagon = VALUES(wagon),
          latest_inning_number = VALUES(latest_inning_number),
          oddstype = VALUES(oddstype),
          session_odds_available = VALUES(session_odds_available),
          weather = VALUES(weather),
          pitch = VALUES(pitch),
          toss = VALUES(toss);
        `;
      // console.log("SQL Query:", query);
      // console.log("Values:", matches);
      await db.query(query, [values]);
    } catch (error) {
      console.error("Error in batch upsert:", error);
    }
  
}

export async function MatchInfo() {
  try {
    const matchQuery = `SELECT match_id FROM matches WHERE match_id not in (SELECT match_id FROM match_info) or (status !=4 and DATE(date_start_ist) BETWEEN DATE(NOW() - INTERVAL 1 DAY) AND DATE(NOW())  and commentary = 1)`;
    // const matchQuery = `SELECT match_id FROM matches `;

    // const matchQuery = `SELECT match_id FROM matches where status in (1,3)`;
    
    const [matchResults]: any = await db.query(matchQuery);

    if (!matchResults.length) {
      console.log("No match IDs found.");
      return;
    }

    // console.log(matchResults);

    // ✅ Limit concurrent API calls (e.g., 5 at a time)
    const limit = pLimit(5);
    let matchStatus = false;
    const apiCalls = matchResults.map((row: { match_id: any }) =>
      limit(async () => {
        try {
          const API_URL = `https://rest.entitysport.com/exchange/matches/${row.match_id}/info?token=7b58d13da34a07b0a047e129874fdbf4`;
          const data = await httpGet(API_URL);
          const matches = data.response;
          const matchId = row.match_id;

          if (matches?.match_info?.status === 2) {
            matchStatus = true;
          }

          const fileData = JSON.stringify(matches, null, 2);
          const s3Key = `MatchData/match_${matchId}.json`;
          const params:any = {
            Bucket: BUCKET_NAME,
            Key: s3Key,
            Body: fileData, 
            ContentType: 'application/json', 
          };

          const command = new PutObjectCommand(params);
          const s3Upload = await s3.send(command);
          console.log(`File uploaded successfully to ${s3Upload}`);
          // const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;
          // Define absolute file path on Windows
          // const storageDir = "/var/tmp/ucc/MatchData";
          // if (!fs.existsSync(storageDir))
          //   fs.mkdirSync(storageDir, { recursive: true });

          // const filePath = path.join(storageDir, `match_${matchId}.json`);
          // fs.writeFileSync(filePath, JSON.stringify(matches, null, 2));

          // const formattedFilePath = filePath.replace(/\\/g, "\\\\"); // Escape backslashes
          const query = `
                        INSERT INTO match_info ( match_id, fileName)
                        VALUES (${matchId}, '${s3Key}') 
                        ON DUPLICATE KEY UPDATE 
                        match_id = ${matchId},
                        fileName = '${s3Key}';`;

          //  const values =  [matchId, filePath ] ;
          await db.query(query);
        } catch (error) {
          console.error(`Failed to fetch match_id ${row.match_id}:`, error);
          return null;
        }
      })
    );
    await Promise.all(apiCalls); // Ensure all API calls finish

    // console.log(`Data saved. Match status:`, matchStatus);

    // if (matchStatus) {
    //   await InsertOrUpdateCompletedMatches();
    // }
  } catch (error) {
    console.error("Error executing function:", error);
  }
}

export async function MatchCommentary() {
  const API_TOKEN = "7b58d13da34a07b0a047e129874fdbf4";
  const CONCURRENT_LIMIT = 5;
  try {
    // const matchQuery = `SELECT match_id, latest_inning_number FROM matches WHERE commentary = 1 and match_id not in (SELECT match_id FROM match_commentary) and status in (2,3) and latest_inning_number > 0 `;
    // const matchQuery = `SELECT match_id, latest_inning_number FROM matches WHERE commentary = 1 and status = 3 and latest_inning_number > 0 `;
    const matchQuery = `SELECT match_id, latest_inning_number FROM matches WHERE commentary = 1 and latest_inning_number > 0 `;
    
    const [matchResults]: any = await db.query(matchQuery);

    if (!matchResults.length) {
      console.log("No match IDs found.");
      return;
    }


    const limit = pLimit(CONCURRENT_LIMIT);
    const apiCalls = matchResults.flatMap(
      (match: { match_id: any; latest_inning_number: any }) => {
        const { match_id, latest_inning_number } = match;

        // Generate an array of innings from 1 to latest_inning_number
        return Array.from(
          { length: latest_inning_number },
          (_, i) => i + 1
        ).map((inningNumber) =>
          limit(async () => {
            try {
              const API_URL = `https://rest.entitysport.com/exchange/matches/${match_id}/innings/${inningNumber}/commentary?token=${API_TOKEN}`;
              const data = await httpGet(API_URL);
              const commentaryData = data.response;

              if (!commentaryData) {
                console.log(
                  `No commentary data for match_id ${match_id}, inning ${inningNumber}`
                );
                return;
              }

              const fileData = JSON.stringify(commentaryData, null, 2);
              const s3Key = `MatchCommentaryData/match_commentary_${inningNumber}inning_${match_id}.json`;
              const params:any = {
                Bucket: BUCKET_NAME,
                Key: s3Key,
                Body: fileData, 
                ContentType: 'application/json', 
              };

              const command = new PutObjectCommand(params);
              const s3Upload = await s3.send(command);

            
              const insertQuery = `
                INSERT INTO match_commentary (match_id, innings, fileName)
                VALUES (?, ?, ?) 
                ON DUPLICATE KEY UPDATE fileName = ?;
              `;
              await db.query(insertQuery, [
                match_id,
                inningNumber,
                s3Key,
                s3Key,
              ]);

             
            } catch (error) {
              console.error(
                `Failed to fetch commentary for match_id ${match_id}, inning ${inningNumber}:`,
                error
              );
            }
          })
        );
      }
    );

    // Wait for all API calls to finish
    await Promise.all(apiCalls);
    console.log("All match commentaries processed successfully.");
  } catch (error) {
    console.error("Error executing MatchCommentary function:", error);
  }
}

export async function MatchCommentaryCompleted() {
  const API_TOKEN = "7b58d13da34a07b0a047e129874fdbf4";
  const CONCURRENT_LIMIT = 5;
  try {
    const matchQuery = `SELECT * FROM matches WHERE status = 2 and commentary = 1 and DATE(date_end_ist) BETWEEN DATE(NOW() - INTERVAL 15 DAY) AND DATE(NOW()) and latest_inning_number > 0 `;
    // const matchQuery = `SELECT match_id, latest_inning_number FROM matches WHERE commentary = 1 and status = 3 and latest_inning_number > 0 `;
    
    const [matchResults]: any = await db.query(matchQuery);

    if (!matchResults.length) {
      console.log("No match IDs found.");
      return;
    }

    const limit = pLimit(CONCURRENT_LIMIT);
    const apiCalls = matchResults.flatMap(
      (match: { match_id: any; latest_inning_number: any }) => {
        const { match_id, latest_inning_number } = match;

        // Generate an array of innings from 1 to latest_inning_number
        return Array.from(
          { length: latest_inning_number },
          (_, i) => i + 1
        ).map((inningNumber) =>
          limit(async () => {
            try {
              const API_URL = `https://rest.entitysport.com/exchange/matches/${match_id}/innings/${inningNumber}/commentary?token=${API_TOKEN}`;
              const data = await httpGet(API_URL);
              const commentaryData = data.response;

              if (!commentaryData) {
                console.log(
                  `No commentary data for match_id ${match_id}, inning ${inningNumber}`
                );
                return;
              }

              const fileData = JSON.stringify(commentaryData, null, 2);
              const s3Key = `MatchCommentaryData/match_commentary_${inningNumber}inning_${match_id}.json`;
              const params:any = {
                Bucket: BUCKET_NAME,
                Key: s3Key,
                Body: fileData, 
                ContentType: 'application/json', 
              };

              const command = new PutObjectCommand(params);
              const s3Upload = await s3.send(command);
             

              const insertQuery = `
                INSERT INTO match_commentary (match_id, innings, fileName)
                VALUES (?, ?, ?) 
                ON DUPLICATE KEY UPDATE fileName = ?;
              `;
              await db.query(insertQuery, [
                match_id,
                inningNumber,
                s3Key,
                s3Key,
              ]);

              // console.log(`Commentary saved for match ${match_id}, inning ${inningNumber}`);
            } catch (error) {
              console.error(
                `Failed to fetch commentary for match_id ${match_id}, inning ${inningNumber}:`,
                error
              );
            }
          })
        );
      }
    );

    // Wait for all API calls to finish
    await Promise.all(apiCalls);
    console.log("All match commentaries processed successfully.");
  } catch (error) {
    console.error("Error executing MatchCommentary function:", error);
  }
}

export async function MatchStatistics() {
  try {
    // const matchQuery = `SELECT match_id FROM matches WHERE match_id not in (SELECT match_id FROM match_statistics) or (status !=4 and date(date_start_ist) = date(now()))`;
    const matchQuery = `SELECT match_id FROM matches WHERE match_id not in (SELECT match_id FROM match_statistics) or (status = 3 and DATE(date_start_ist) BETWEEN DATE(NOW() - INTERVAL 1 DAY) AND DATE(NOW()))`;
    
    const [matchResults]: any = await db.query(matchQuery);

    if (!matchResults.length) {
      console.log("No match IDs found.");
      return;
    }

    // console.log(matchResults);

    // ✅ Limit concurrent API calls (e.g., 5 at a time)
    const limit = pLimit(5);

    const apiCalls = matchResults.map((row: { match_id: any }) =>
      limit(async () => {
        try {
          const API_URL = `https://rest.entitysport.com/exchange/matches/${row.match_id}/statistics?token=7b58d13da34a07b0a047e129874fdbf4`;
          const data = await httpGet(API_URL);
          const matches = data.response;
          const matchId = row.match_id;

          const fileData = JSON.stringify(matches, null, 2);
              const s3Key = `MatchStatisticsData/match_${matchId}.json`;
              const params:any = {
                Bucket: BUCKET_NAME,
                Key: s3Key,
                Body: fileData, 
                ContentType: 'application/json', 
              };

              const command = new PutObjectCommand(params);
              const s3Upload = await s3.send(command);
          // Define absolute file path on Windows
        
          const query = `
                        INSERT INTO match_statistics ( match_id, fileName)
                        VALUES (${matchId}, '${s3Key}') 
                        ON DUPLICATE KEY UPDATE 
                        match_id = ${matchId},
                        fileName = '${s3Key}';`;
          // console.log(`Data saved to`, query);
          //  const values =  [matchId, filePath ] ;
          await db.query(query);
        } catch (error) {
          console.error(`Failed to fetch match_id ${row.match_id}:`, error);
          return null;
        }
      })
    );
  } catch (error) {
    console.error("Error executing function:", error);
  }
}

export async function MatchStatisticsCompleted() {
  try {
    // const matchQuery = `SELECT match_id FROM matches WHERE match_id not in (SELECT match_id FROM match_statistics) or (status !=4 and date(date_start_ist) = date(now()))`;
    const matchQuery = `SELECT match_id FROM matches WHERE match_id not in (SELECT match_id FROM match_statistics) or (status = 2 and DATE(date_start_ist) BETWEEN DATE(NOW() - INTERVAL 15 DAY) AND DATE(NOW()))`;
    
    const [matchResults]: any = await db.query(matchQuery);

    if (!matchResults.length) {
      console.log("No match IDs found.");
      return;
    }

    // console.log(matchResults);

    // ✅ Limit concurrent API calls (e.g., 5 at a time)
    const limit = pLimit(5);

    const apiCalls = matchResults.map((row: { match_id: any }) =>
      limit(async () => {
        try {
          const API_URL = `https://rest.entitysport.com/exchange/matches/${row.match_id}/statistics?token=7b58d13da34a07b0a047e129874fdbf4`;
          const data = await httpGet(API_URL);
          const matches = data.response;
          const matchId = row.match_id;

          const fileData = JSON.stringify(matches, null, 2);
              const s3Key = `MatchStatisticsData/match_${matchId}.json`;
              const params:any = {
                Bucket: BUCKET_NAME,
                Key: s3Key,
                Body: fileData, 
                ContentType: 'application/json', 
              };

              const command = new PutObjectCommand(params);
              const s3Upload = await s3.send(command);
         
          const query = `
                        INSERT INTO match_statistics ( match_id, fileName)
                        VALUES (${matchId}, '${s3Key}') 
                        ON DUPLICATE KEY UPDATE 
                        match_id = ${matchId},
                        fileName = '${s3Key}';`;
          // console.log(`Data saved to`, query);
          //  const values =  [matchId, filePath ] ;
          await db.query(query);
        } catch (error) {
          console.error(`Failed to fetch match_id ${row.match_id}:`, error);
          return null;
        }
      })
    );
  } catch (error) {
    console.error("Error executing function:", error);
  }
}


export async function Last10MatchData() {
  try {
    const matchQuery = `SELECT match_id FROM matches WHERE match_id not in (SELECT match_id FROM match_advance)`;
    
    const [matchResults]: any = await db.query(matchQuery);

    if (!matchResults.length) {
      console.log("No match IDs found.");
      return;
    }

    // console.log(matchResults);

    // ✅ Limit concurrent API calls (e.g., 5 at a time)
    const limit = pLimit(5);

    const apiCalls = matchResults.map((row: { match_id: any }) =>
      limit(async () => {
        try {
          const API_URL = `https://rest.entitysport.com/v4/matches/${row.match_id}/advance?token=7b58d13da34a07b0a047e129874fdbf4`;
          const data = await httpGet(API_URL);
          const matches = data.response;
          const matchId = row.match_id;

          const fileData = JSON.stringify(matches, null, 2);
          const s3Key = `MatchAdvanceData/match_${matchId}.json`;
          const params:any = {
            Bucket: BUCKET_NAME,
            Key: s3Key,
            Body: fileData, 
            ContentType: 'application/json', 
          };

          const command = new PutObjectCommand(params);
          const s3Upload = await s3.send(command);
         
          const query = `
                        INSERT INTO match_advance ( match_id, fileName)
                        VALUES (${matchId}, '${s3Key}') 
                        ON DUPLICATE KEY UPDATE 
                        match_id = ${matchId},
                        fileName = '${s3Key}';`;
          // console.log(`Data saved to`, query);
          //  const values =  [matchId, filePath ] ;
          await db.query(query);
        } catch (error) {
          console.error(`Failed to fetch match_id ${row.match_id}:`, error);
          return null;
        }
      })
    );
  } catch (error) {
    console.error("Error executing function:", error);
  }
}

export async function InsertOrUpdateLiveCompetitions() {
  const API_URL =
    "https://rest.entitysport.com/exchange/competitions?token=7b58d13da34a07b0a047e129874fdbf4&per_page=100&status=live";

  const data = await httpGet(API_URL);
  const competitions = data?.response?.items || [];
  const totalPages = data?.response?.total_pages || 0;

  if (totalPages > 1) {
    await delay(200);

    // Create an array of promises to fetch all pages in parallel
    const requests = Array.from({ length: totalPages }, (_, i) =>
      httpGet(`${API_URL}&paged=${i + 1}`)
    );

    // Fetch all pages simultaneously
    const results = await Promise.all(requests);

    // Collect all match data
    results.forEach((pagedata) => {
      competitions.push(...(pagedata?.response?.items || []));
    });
  }

  console.log("Values:", competitions);
  if (competitions.length > 0) {
    try {
      const values = competitions.map(
        (compt: {
          cid: any;
          title: any;
          abbr: any;
          category: any;
          status: any;
          game_format: any;
          season: any;
          datestart: any;
          dateend: any;
          country: any;
          total_matches: any;
          total_rounds: any;
          total_teams: any;
        }) => [
          compt.cid,
          compt.title,
          compt.abbr,
          compt.category,
          compt.status,
          compt.game_format,
          compt.season,
          compt.datestart,
          compt.dateend,
          compt.country,
          compt.total_matches,
          compt.total_rounds,
          compt.total_teams,
        ]
      );

      const query = `
              INSERT INTO competitions ( cid,
            title,
            abbr,
            category,
            status,
            game_format,
            season,
            datestart,
            dateend,
            country,
            total_matches,
            total_rounds,
            total_teams)
              VALUES ?
              ON DUPLICATE KEY UPDATE 
                  title = VALUES(title),
            abbr = VALUES(abbr),
            category = VALUES(category),
            status = VALUES(status),
            game_format = VALUES(game_format),
            season = VALUES(season),
            datestart = VALUES(datestart),
            dateend = VALUES(dateend),
            country = VALUES(country),
            total_matches = VALUES(total_matches),
            total_rounds = VALUES(total_rounds),
            total_teams = VALUES(total_teams);
          `;
      // console.log("SQL Query:", query);
      // console.log("Values:", matches);
      await db.query(query, [values]);
    } catch (error) {
      console.error("Error in competitions upsert:", error);
    }
  }
}
export async function InsertOrUpdateUpcomingCompetitions() {
  const API_URL =
    "https://rest.entitysport.com/exchange/competitions?token=7b58d13da34a07b0a047e129874fdbf4&per_page=100&status=fixture";

  const data = await httpGet(API_URL);
  const competitions = data?.response?.items || [];
  const totalPages = data?.response?.total_pages || 0;

  if (totalPages > 1) {
    await delay(200);

    // Create an array of promises to fetch all pages in parallel
    const requests = Array.from({ length: totalPages }, (_, i) =>
      httpGet(`${API_URL}&paged=${i + 1}`)
    );

    // Fetch all pages simultaneously
    const results = await Promise.all(requests);

    // Collect all match data
    results.forEach((pagedata) => {
      competitions.push(...(pagedata?.response?.items || []));
    });
  }

  console.log("Values:", competitions);
  if (competitions.length > 0) {
    try {
      const values = competitions.map(
        (compt: {
          cid: any;
          title: any;
          abbr: any;
          category: any;
          status: any;
          game_format: any;
          season: any;
          datestart: any;
          dateend: any;
          country: any;
          total_matches: any;
          total_rounds: any;
          total_teams: any;
        }) => [
          compt.cid,
          compt.title,
          compt.abbr,
          compt.category,
          compt.status,
          compt.game_format,
          compt.season,
          compt.datestart,
          compt.dateend,
          compt.country,
          compt.total_matches,
          compt.total_rounds,
          compt.total_teams,
        ]
      );

      const query = `
              INSERT INTO competitions ( cid,
            title,
            abbr,
            category,
            status,
            game_format,
            season,
            datestart,
            dateend,
            country,
            total_matches,
            total_rounds,
            total_teams)
              VALUES ?
              ON DUPLICATE KEY UPDATE 
                  title = VALUES(title),
            abbr = VALUES(abbr),
            category = VALUES(category),
            status = VALUES(status),
            game_format = VALUES(game_format),
            season = VALUES(season),
            datestart = VALUES(datestart),
            dateend = VALUES(dateend),
            country = VALUES(country),
            total_matches = VALUES(total_matches),
            total_rounds = VALUES(total_rounds),
            total_teams = VALUES(total_teams);
          `;
      // console.log("SQL Query:", query);
      // console.log("Values:", matches);
      await db.query(query, [values]);
    } catch (error) {
      console.error("Error in competitions upsert:", error);
    }
  }
}

export async function CompetitionInfo() {
  try {
    const competitionsQuery = `SELECT cid FROM competitions WHERE cid not in (SELECT cid FROM competition_info) or (date(dateend) >= date(now()) and status = 'result') or status = 'live'`;
   
    const [competitionsResults]: any = await db.query(
      competitionsQuery
    );

    if (!competitionsResults.length) {
      console.log("No match IDs found.");
      return;
    }

    // console.log(matchResults);

    // ✅ Limit concurrent API calls (e.g., 5 at a time)
    const limit = pLimit(5);

    const apiCalls = competitionsResults.map((row: { cid: any }) =>
      limit(async () => {
        try {
          const API_URL = `https://rest.entitysport.com/exchange/competitions/${row.cid}/info?token=7b58d13da34a07b0a047e129874fdbf4`;
          const data = await httpGet(API_URL);
          const serieses = data.response;
          const cid = row.cid;

          const fileData = JSON.stringify(serieses, null, 2);
          const s3Key = `CompetitionData/competition_${cid}.json`;
          const params:any = {
            Bucket: BUCKET_NAME,
            Key: s3Key,
            Body: fileData, 
            ContentType: 'application/json', 
          };

          const command = new PutObjectCommand(params);
          const s3Upload = await s3.send(command);
        
          const query = `
                        INSERT INTO competition_info ( cid, fileName)
                        VALUES (${cid}, '${s3Key}') 
                        ON DUPLICATE KEY UPDATE 
                        cid = ${cid},
                        fileName = '${s3Key}';`;
          // console.log(`Data saved to`, query);
          //  const values =  [matchId, filePath ] ;
          await db.query(query);
        } catch (error) {
          console.error(`Failed to fetch cid ${row.cid}:`, error);
          return null;
        }
      })
    );
  } catch (error) {
    console.error("Error executing function:", error);
  }
}

export async function CompetitionMatches() {
  try {
    const competitionsQuery = `SELECT cid FROM competitions WHERE cid not in (SELECT cid FROM competition_matches) or (date(dateend) >= date(now()) and status = 'result') or status = 'live'`;
   
    const [competitionsResults]: any = await db.query(
      competitionsQuery
    );

    if (!competitionsResults.length) {
      console.log("No match IDs found.");
      return;
    }

    // console.log(matchResults);

    // ✅ Limit concurrent API calls (e.g., 5 at a time)
    const limit = pLimit(5);

    const apiCalls = competitionsResults.map((row: { cid: any }) =>
      limit(async () => {
        try {
          const API_URL = `https://rest.entitysport.com/exchange/competitions/${row.cid}/matches?token=7b58d13da34a07b0a047e129874fdbf4&per_page=100`;

          const data = await httpGet(API_URL);
          const matches = data?.response || [];
          const totalPages = data?.response?.total_pages || 0;

          if (totalPages > 1) {
            await delay(200);

            // Create an array of promises to fetch all pages in parallel
            const requests = Array.from({ length: totalPages }, (_, i) =>
              httpGet(`${API_URL}&paged=${i + 1}`)
            );

            // Fetch all pages simultaneously
            const results = await Promise.all(requests);

            // Collect all match data
            results.forEach((pagedata) => {
              matches.push(...(pagedata?.response || []));
            });
          }

          const serieses = matches;
          const cid = row.cid;

          const fileData = JSON.stringify(serieses, null, 2);
          const s3Key = `CompetitionMatchesData/competition_match_${cid}.json`;
          const params:any = {
            Bucket: BUCKET_NAME,
            Key: s3Key,
            Body: fileData, 
            ContentType: 'application/json', 
          };

          const command = new PutObjectCommand(params);
          const s3Upload = await s3.send(command);
          
          const query = `
                        INSERT INTO competition_matches ( cid, fileName)
                        VALUES (${cid}, '${s3Key}') 
                        ON DUPLICATE KEY UPDATE 
                        cid = ${cid},
                        fileName = '${s3Key}';`;
          // console.log(`Data saved to`, query);
          //  const values =  [matchId, filePath ] ;
          await db.query(query);
        } catch (error) {
          console.error(`Failed to fetch cid ${row.cid}:`, error);
          return null;
        }
      })
    );
  } catch (error) {
    console.error("Error executing function:", error);
  }
}

export async function CompetitionsStats() {
  try {
    const competitionsQuery = `SELECT cid FROM competitions WHERE date(dateend) >= date(now()) and status = 'result' or status = 'live'`;
    
    const [competitionsResults]: any = await db.query(
      competitionsQuery
    );

    if (!competitionsResults.length) {
      console.log("No match IDs found.");
      return;
    }

    const stats = [
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
      "bowling_best_strike_rates",
    ];
    // console.log(matchResults);

    // ✅ Limit concurrent API calls (e.g., 5 at a time)
    const limit = pLimit(5);

    const apiCalls = competitionsResults.map((row: { cid: any }) =>
      limit(async () => {
        try {
          for (const stat of stats) {
            const statType = stat;
            const API_URL = `https://rest.entitysport.com/exchange/competitions/${row.cid}/stats/${statType}?token=7b58d13da34a07b0a047e129874fdbf4`;

            const data = await httpGet(API_URL);
            const competition = data.response;
            const cid = row.cid;

            const fileData = JSON.stringify(competition, null, 2);
          const s3Key = `CompetitionStatsData/competition_${statType}_${cid}.json`;
          const params:any = {
            Bucket: BUCKET_NAME,
            Key: s3Key,
            Body: fileData, 
            ContentType: 'application/json', 
          };

          const command = new PutObjectCommand(params);
          const s3Upload = await s3.send(command);
           
            const query = `
                        INSERT INTO competition_stats ( cid, statsName, fileName)
                        VALUES (${cid}, '${statType}', '${s3Key}') 
                        ON DUPLICATE KEY UPDATE 
                        statsName = VALUES(statsName);`;
            await db.query(query);
          }
        } catch (error) {
          console.error(`Failed to fetch match_id ${row.cid}:`, error);
          return null;
        }
      })
    );
  } catch (error) {
    console.error("Error executing function:", error);
  }
}
export async function InsertOrUpdateTeams() {
  const API_URL =
    "https://rest.entitysport.com/exchange/teams?token=7b58d13da34a07b0a047e129874fdbf4&per_page=100";

  const data = await httpGet(API_URL);
  const teams = data?.response?.items || [];
  const totalPages = data?.response?.total_pages || 0;

  if (totalPages > 1) {
    await delay(200);

    // Create an array of promises to fetch all pages in parallel
    const requests = Array.from({ length: totalPages }, (_, i) =>
      httpGet(`${API_URL}&paged=${i + 1}`)
    );

    // Fetch all pages simultaneously
    const results = await Promise.all(requests);

    // Collect all match data
    results.forEach((pagedata) => {
      teams.push(...(pagedata?.response?.items || []));
    });
  }

  if (teams.length > 0) {
    try {
      const values = teams.map(
        (teams: {
          tid: any;
          title: any;
          abbr: any;
          alt_name: any;
          type: any;
          thumb_url: any;
          logo_url: any;
          country: any;
          sex: any;
          matches_url: any;
        }) => [
          teams.tid,
          teams.title,
          teams.abbr,
          teams.alt_name,
          teams.type,
          teams.thumb_url,
          teams.logo_url,
          teams.country,
          teams.sex,
          teams.matches_url,
        ]
      );

      const query = `
              INSERT INTO teams ( tid, title, abbr, alt_name, type, thumb_url, logo_url, country, sex, matches_url)
              VALUES ?
              ON DUPLICATE KEY UPDATE 
                  title = VALUES(title),
            abbr = VALUES(abbr),
            alt_name = VALUES(alt_name),
            type = VALUES(type),
            thumb_url = VALUES(thumb_url),
            logo_url = VALUES(logo_url),
            country = VALUES(country),
            sex = VALUES(sex),
            matches_url = VALUES(matches_url);
          `;
      // console.log("SQL Query:", query);
      // console.log("Values:", matches);
      await db.query(query, [values]);
    } catch (error) {
      console.error("Error in teams upsert:", error);
    }
  }
}
export async function TeamPlayersData() {
  try {
    const teamQuery = `SELECT tid FROM teams`;
    const [teamResults]: any = await db.query(teamQuery);

    if (!teamResults.length) {
      console.log("No team IDs found.");
      return;
    }

    const limit = pLimit(5);

    const apiCalls = teamResults.map((row: { tid: any }) =>
      limit(async () => {
        try {
          const API_URL = `https://rest.entitysport.com/exchange/teams/${row.tid}/player?token=7b58d13da34a07b0a047e129874fdbf4`;
          const data = await httpGet(API_URL);
          const serieses = data.response;
          const tid = row.tid;

          const fileData = JSON.stringify(serieses, null, 2);
          const s3Key = `TeamPlayerData/teamPlayer_${tid}.json`;
          const params:any = {
            Bucket: BUCKET_NAME,
            Key: s3Key,
            Body: fileData, 
            ContentType: 'application/json', 
          };

          const command = new PutObjectCommand(params);
          const s3Upload = await s3.send(command);
         
          const query = `
                        INSERT INTO team_player ( tid, fileName)
                        VALUES (${tid}, '${s3Key}') 
                        ON DUPLICATE KEY UPDATE 
                        tid = ${tid},
                        fileName = '${s3Key}';`;
          // console.log(`Data saved to`, query);
          //  const values =  [matchId, filePath ] ;
          await db.query(query);
        } catch (error) {
          console.error(`Failed to fetch cid ${row.tid}:`, error);
          return null;
        }
      })
    );
  } catch (error) {
    console.error("Error executing function:", error);
  }
}

export async function TeamMatches() {
  try {
    // const teamsQuery = `SELECT tid FROM teams WHERE tid not in (SELECT tid FROM team_matches)`;
    const teamsQuery = `SELECT tid FROM teams`;
    const [teamsResults]: any = await db.query(teamsQuery);

    if (!teamsResults.length) {
      console.log("No match IDs found.");
      return;
    }

    const limit = pLimit(5);

    const apiCalls = teamsResults.map((row: { tid: any }) =>
      limit(async () => {
        try {
          const API_URL = `https://rest.entitysport.com/exchange/teams/${row.tid}/matches?token=7b58d13da34a07b0a047e129874fdbf4&per_page=100`;

          const data = await httpGet(API_URL);
          const matches = data?.response || [];
          const totalPages = data?.response?.total_pages || 0;

          if (totalPages > 1) {
            await delay(200);

            // Create an array of promises to fetch all pages in parallel
            const requests = Array.from({ length: totalPages }, (_, i) =>
              httpGet(`${API_URL}&paged=${i + 1}`)
            );

            // Fetch all pages simultaneously
            const results = await Promise.all(requests);

            // Collect all match data
            let matches: any[] = [];

            results.forEach((pagedata) => {
              const responseData = Array.isArray(pagedata?.response)
                ? pagedata.response
                : [];
              matches.push(...responseData);
            });

            // results.forEach(pagedata => {
            //   matches.push(...pagedata?.response || []);
            // });
          }

          const serieses = matches;
          const tid = row.tid;


          const fileData = JSON.stringify(serieses, null, 2);
          const s3Key = `TeamMatchesData/team_match_${tid}.json`;
          const params:any = {
            Bucket: BUCKET_NAME,
            Key: s3Key,
            Body: fileData, 
            ContentType: 'application/json', 
          };

          const command = new PutObjectCommand(params);
          const s3Upload = await s3.send(command);
          
          const query = `
                        INSERT INTO team_matches ( tid, fileName)
                        VALUES (${tid}, '${s3Key}') 
                        ON DUPLICATE KEY UPDATE 
                        tid = ${tid},
                        fileName = '${s3Key}';`;
          // console.log(`Data saved to`, query);
          //  const values =  [matchId, filePath ] ;
          await db.query(query);
        } catch (error) {
          console.error(`Failed to fetch cid ${row.tid}:`, error);
          return null;
        }
      })
    );
  } catch (error) {
    console.error("Error executing function:", error);
  }
}

export async function InsertOrUpdatePlayers() {
  const API_URL =
    "https://rest.entitysport.com/exchange/players?token=7b58d13da34a07b0a047e129874fdbf4&per_page=100";

  const data = await httpGet(API_URL);
  const players = data?.response?.items || [];
  const totalPages = data?.response?.total_pages || 0;

  if (totalPages > 1) {
    await delay(200);

    // Create an array of promises to fetch all pages in parallel
    const requests = Array.from({ length: totalPages }, (_, i) =>
      httpGet(`${API_URL}&paged=${i + 1}`)
    );

    // Fetch all pages simultaneously
    const results = await Promise.all(requests);

    // Collect all match data
    results.forEach((pagedata) => {
      players.push(...(pagedata?.response?.items || []));
    });
  }

  console.log("Values:", players);
  if (players.length > 0) {
    try {
      const values = players.map(
        (players: {
          pid: any;
          title: any;
          short_name: any;
          first_name: any;
          last_name: any;
          middle_name: any;
          birthdate: any;
          birthplace: any;
          country: any;
          logo_url: any;
          playing_role: any;
          batting_style: any;
          bowling_style: any;
          fielding_position: any;
          facebook_profile: any;
          twitter_profile: any;
          instagram_profile: any;
          nationality: any;
        }) => [
          players.pid,
          players.title,
          players.short_name,
          players.first_name,
          players.last_name,
          players.middle_name,
          players.birthdate,
          players.birthplace,
          players.country,
          players.logo_url,
          players.playing_role,
          players.batting_style,
          players.bowling_style,
          players.fielding_position,
          players.facebook_profile,
          players.twitter_profile,
          players.instagram_profile,
          players.nationality,
        ]
      );

      const query = `
              INSERT INTO players ( pid, title, short_name, first_name, last_name, middle_name, birthdate, birthplace, 
    country, logo_url, playing_role, batting_style, bowling_style, fielding_position, 
    facebook_profile, twitter_profile, instagram_profile, nationality)
              VALUES ?
              ON DUPLICATE KEY UPDATE 
                title = VALUES(title),
                short_name = VALUES(short_name),
                first_name = VALUES(first_name),
                last_name = VALUES(last_name),
                middle_name = VALUES(middle_name),
                birthdate = VALUES(birthdate),
                birthplace = VALUES(birthplace),
                country = VALUES(country),
                logo_url = VALUES(logo_url),
                playing_role = VALUES(playing_role),
                batting_style = VALUES(batting_style),
                bowling_style = VALUES(bowling_style),
                fielding_position = VALUES(fielding_position),
                facebook_profile = VALUES(facebook_profile),
                twitter_profile = VALUES(twitter_profile),
                instagram_profile = VALUES(instagram_profile),
                nationality = VALUES(nationality);
          `;
      // console.log("SQL Query:", query);
      // console.log("Values:", matches);
      await db.query(query, [values]);
    } catch (error) {
      console.error("Error in players upsert:", error);
    }
  }
}

export async function PlayerStatsData() {
  try {
    const playerQuery = `SELECT pid FROM players`;
    const [playerResults]: any = await db.query(playerQuery);

    if (!playerResults.length) {
      console.log("No player IDs found.");
      return;
    }

    // console.log(playerResults);

    // ✅ Limit concurrent API calls (e.g., 5 at a time)
    const limit = pLimit(5);
    const apiCalls = playerResults.map((row: { pid: any }) =>
      limit(async () => {
        try {
          const API_URL = `https://rest.entitysport.com/exchange/players/${row.pid}/stats?token=7b58d13da34a07b0a047e129874fdbf4`;
          const data = await httpGet(API_URL);
          const players = data.response;
          const pid = row.pid;

          const fileData = JSON.stringify(players, null, 2);
          const s3Key = `PlayerStatsData/player_stats_${pid}.json`;
          const params:any = {
            Bucket: BUCKET_NAME,
            Key: s3Key,
            Body: fileData, 
            ContentType: 'application/json', 
          };

          const command = new PutObjectCommand(params);
          const s3Upload = await s3.send(command);
        
          const query = `
                        INSERT INTO player_stats ( pid, fileName)
                        VALUES (${pid}, '${s3Key}') 
                        ON DUPLICATE KEY UPDATE 
                        pid = ${pid},
                        fileName = '${s3Key}';`;
          console.log(`Data saved to`, query);
          //  const values =  [matchId, filePath ] ;
          await db.query(query);
        } catch (error) {
          console.error(`Failed to fetch cid ${row.pid}:`, error);
          return null;
        }
      })
    );
  } catch (error) {
    console.error("Error executing function:", error);
  }
}

export async function PlayerAdvanceStatsData() {
  try {
    const playerQuery = `SELECT pid FROM players`;
    const [playerResults]: any = await db.query(playerQuery);

    if (!playerResults.length) {
      console.log("No player IDs found.");
      return;
    }

    // console.log(playerResults);

    // ✅ Limit concurrent API calls (e.g., 5 at a time)
    const limit = pLimit(5);
    const apiCalls = playerResults.map((row: { pid: any }) =>
      limit(async () => {
        try {
          const API_URL = `https://rest.entitysport.com/v4/players/${row.pid}/advancestats?token=7b58d13da34a07b0a047e129874fdbf4`;
          const data = await httpGet(API_URL);
          const players = data.response;
          const pid = row.pid;

          const fileData = JSON.stringify(players, null, 2);
          const s3Key = `PlayerAdvanceStatsData/player_advance_stats_${pid}.json`;
          const params:any = {
            Bucket: BUCKET_NAME,
            Key: s3Key,
            Body: fileData, 
            ContentType: 'application/json', 
          };

          const command = new PutObjectCommand(params);
          const s3Upload = await s3.send(command);
          
          const query = `
                        INSERT INTO player_advance_stats ( pid, fileName)
                        VALUES (${pid}, '${s3Key}') 
                        ON DUPLICATE KEY UPDATE 
                        pid = ${pid},
                        fileName = '${s3Key}';`;
          console.log(`Data saved to`, query);
          //  const values =  [matchId, filePath ] ;
          await db.query(query);
        } catch (error) {
          console.error(`Failed to fetch cid ${row.pid}:`, error);
          return null;
        }
      })
    );
  } catch (error) {
    console.error("Error executing function:", error);
  }
}