import { WebSocket } from "ws";
import db from "./src/config/db";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from './src/lib/aws'

const BUCKET_NAME = 'uc-application';
const LIFETIME_TOKEN = "7b58d13da34a07b0a047e129874fdbf4";

class WebSocketService {
  private ws: WebSocket | null = null;
  private retryCount: number = 0;
  private maxRetries: number = Infinity; // Unlimited retries for lifetime token
  private reconnectInterval: number = 5000;
  private connectionTimeout: number = 30000; // 30 seconds connection timeout
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private connectionTimeoutRef: NodeJS.Timeout | null = null;

  constructor() {
    this.connect();
  }

  private connect() {
    this.cleanup(); // Clean up previous connection if exists

    console.log(`⌛ Connecting to WebSocket (attempt ${this.retryCount + 1})...`);

    this.ws = new WebSocket(
      `ws://webhook.entitysport.com:8087/connect?token=${LIFETIME_TOKEN}`
    );

    // Set connection timeout
    this.connectionTimeoutRef = setTimeout(() => {
      if (this.ws?.readyState !== WebSocket.OPEN) {
        console.warn('Connection timeout reached. Reconnecting...');
        this.ws?.terminate();
        this.scheduleReconnect();
      }
    }, this.connectionTimeout);

    this.ws.on("open", () => {
      this.retryCount = 0;
      clearTimeout(this.connectionTimeoutRef!);
      console.log("✅ WebSocket Connected");
      
      // Start heartbeat
      this.heartbeatInterval = setInterval(() => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.ping();
        }
      }, 30000); // Send ping every 30 seconds
    });

    this.ws.on("pong", () => {
      console.debug('🏓 WebSocket heartbeat acknowledged');
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

    this.ws.on("close", (code, reason) => {
      console.warn(`❌ WebSocket Disconnected (code: ${code}, reason: ${reason.toString()})`);
      this.cleanup();
      this.scheduleReconnect();
    });

    this.ws.on("error", (err: Error) => {
      console.error("WebSocket Error:", err.message);
      if (err.message.includes("invalid token")) {
        console.error("Permanent token error - check token validity");
        process.exit(1); // Exit if token is truly invalid
      }
    });
  }

  private cleanup() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    if (this.connectionTimeoutRef) {
      clearTimeout(this.connectionTimeoutRef);
      this.connectionTimeoutRef = null;
    }
    
    if (this.ws) {
      this.ws.removeAllListeners();
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.close();
      }
      this.ws = null;
    }
  }

  private scheduleReconnect() {
    if (this.retryCount >= this.maxRetries) {
      console.error("Max reconnection attempts reached. Restarting process...");
      process.exit(1); // Let PM2 restart the service
      return;
    }

    this.retryCount++;
    const delay = Math.min(
      this.reconnectInterval * Math.pow(1.5, this.retryCount),
      60000 // Max 1 minute delay
    );
    
    console.log(`⏳ Reconnecting in ${delay/1000} seconds...`);
    setTimeout(() => this.connect(), delay);
  }

  private async processData(data: any) {
    if (!data.match_id) return;

    try {
      const matchId = data.match_id;
      
      // Ball-by-ball data
      if (data.ball_event) {
        await db.query(
          `UPDATE match_info SET ball_event = ? WHERE match_id = ?`,
          [data.ball_event, matchId]
        );
        console.debug(`Ball event updated for match ${matchId}`);
      }

      // Match data
      if (data.match_info) {
        const s3Key = `MatchData/match_${matchId}.json`;
        const fileData = JSON.stringify(data, null, 2);
        
        await this.uploadToS3(s3Key, fileData);
        await this.updateMatchRecord(matchId, s3Key);
        
        console.log(`✅ Match data saved for ${data.match_info.title}`);
      }
    } catch (err) {
      console.error("Data processing failed:", err);
    }
  }

  private async uploadToS3(key: string, data: string) {
    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: key,
          Body: data,
          ContentType: 'application/json',
        })
      );
    } catch (err) {
      console.error("S3 upload failed:", err);
      throw err;
    }
  }

  private async updateMatchRecord(matchId: number, fileName: string) {
    await db.query(`
      INSERT INTO match_info (match_id, fileName, updated_date) 
      VALUES (?, ?, NOW()) 
      ON DUPLICATE KEY UPDATE 
        fileName = VALUES(fileName),
        updated_date = NOW()`,
      [matchId, fileName]
    );
  }
}

// Handle process events
process.on("SIGINT", () => {
  console.log("Shutting down gracefully...");
  process.exit(0);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

// Start service
const service = new WebSocketService();