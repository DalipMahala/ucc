const WebSocket = require("ws");
import db from "./src/config/db";
import fs from "fs";
import path from "path";
import s3 from './src/lib/aws'
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const BUCKET_NAME = 'uc-application';

class WebSocketService {
  private socket: WebSocket | null = null;
  ws: any;
  retryCount: number = 0;
  maxRetries: number = 10;
  reconnectInterval: number = 5000;

  async connect() {
    try {
      this.ws = new WebSocket(
        "ws://webhook.entitysport.com:8087/connect?token=7b58d13da34a07b0a047e129874fdbf4"
      );

      this.ws.on("open", () => {
        console.log("✅ WebSocket Connected");
        this.retryCount = 0;
      });

      this.ws.on("message", async (data: string) => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.response) {
            await this.processData(parsed.response);
          }
        } catch (err) {
          console.error("Data processing error:", err);
        }
      });

      this.ws.on("close", () => {
        console.log("❌ WebSocket Disconnected");
        this.reconnect();
      });

      this.ws.on("error", (err: any) => {
        console.error("WebSocket Error:", err);
        this.reconnect();
      });
    } catch (err) {
      console.error("Connection error:", err);
      this.reconnect();
    }
  }

  async processData(data: any) {

    const matchId = data.match_id;
    console.log(`Data event ${data}`);
    // Ball-by-ball data
      if (data.ball_event) {
        const query2 = `UPDATE match_info SET ball_event = '${data.ball_event}' WHERE match_id IN (${matchId})`;

        await db.query(query2);
        console.log(`Data saved for event ${data.ball_event}`);
      }

    if (!data.match_id || !data.match_info) return;
    console.log(
      `Data ${data.match_id} saved for match ${data.match_info.title}`
    );
    try {
      // Match data
      const matches = data;
      

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

     
      const query = `
                     INSERT INTO match_info (match_id, fileName, updated_date) 
                      VALUES (${matchId}, '${s3Key}', NOW()) 
                      ON DUPLICATE KEY UPDATE 
                      fileName = VALUES(fileName),
                      updated_date = NOW()`;

      //  const values =  [matchId, filePath ] ;
      await db.query(query);

        
      console.log(`Data saved for match ${data.match_id}`);
    } catch (err) {
      console.error("Database error:", err);
    }
  }

  reconnect() {
    if (this.retryCount >= this.maxRetries) {
      console.log("Max reconnection attempts reached. Stopping retries.");
      return;
    }

    this.retryCount++;
    console.log(
      `Reconnecting attempt ${this.retryCount}/${this.maxRetries}...`
    );
    setTimeout(() => this.connect(), this.reconnectInterval);
  }
}

// Start service
const service = new WebSocketService();
service.connect();
