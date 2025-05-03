import db from "../config/db";
import { httpGet } from "../lib/http";
const pLimit = require("p-limit");
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from '@/lib/aws';
import getJsonFromS3 from '@/lib/s3-utils';

const BUCKET_NAME = 'uc-application';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


export async function PlayerStatsData() {

  const [pendingCalls] = await db.query<any[]>(
    `SELECT * FROM api_call_queue 
     WHERE status IN ('pending', 'failed') 
     AND retry_count < 3
     ORDER BY created_at ASC
     LIMIT 10`
  );

  for (const row of pendingCalls) {
    try {
      // Mark as processing
      await db.query(
        `UPDATE api_call_queue 
         SET status = 'processing' 
         WHERE id = ?`, 
        [row.id]
      );

      // Process the match
      await processCompletedPlayerStatsData(row.match_id);

      // Mark as completed
      await db.query(
        `UPDATE api_call_queue 
         SET status = 'completed', 
             processed_at = NOW() 
         WHERE id = ?`, 
        [row.id]
      );
    } catch (error) {
      // Update retry count
      await db.query(
        `UPDATE api_call_queue 
         SET status = 'failed', 
             retry_count = retry_count + 1 
         WHERE id = ?`, 
        [row.id]
      );
    }
  }
}

export async function processCompletedPlayerStatsData(matchId: number) {

  if (!matchId) {
    return { notFound: true };
  }
  

  const [rows]: [any[], any]  = await db.execute('SELECT * FROM match_info WHERE match_id = ?',[matchId]);
  
  if (!rows || rows.length === 0) {
    return null;
  }

  const fileName =   rows[0].fileName;
  try {
    const matches = await getJsonFromS3( fileName as string);

    // return matches.players;
    const limit = pLimit(5);
    const apiCalls = matches?.players.map((row: { pid: any }) =>
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
                        fileName = '${s3Key}',
                        updated_date = now()`;
          //  const values =  [matchId, filePath ] ;
          await db.query(query);
          return true;
        } catch (error) {
          console.error(`Failed to fetch pid ${row.pid}:`, error);
          return null;
        }
      })
    );
  } catch (error) {
    console.error("Error executing function:", error);
  }
}