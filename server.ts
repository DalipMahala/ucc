const WebSocket = require("ws");
import db from "./src/config/db";
import fs from "fs";
import path from "path";

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
    if (!data.match_id || !data.match_info) return;
    console.log(
      `Data ${data.match_id} saved for match ${data.match_info.title}`
    );
    try {
      // Match data
      const matches = data;
      const matchId = data.match_id;

      // Define absolute file path on Windows
      const storageDir = "/var/tmp/ucc/MatchData";
      if (!fs.existsSync(storageDir))
        fs.mkdirSync(storageDir, { recursive: true });

      const filePath = path.join(storageDir, `match_${matchId}.json`);
      fs.writeFileSync(filePath, JSON.stringify(matches, null, 2));

      const formattedFilePath = filePath.replace(/\\/g, "\\\\"); // Escape backslashes
      const query = `
                     INSERT INTO match_info (match_id, fileName, updated_date) 
                      VALUES (${matchId}, '${formattedFilePath}', NOW()) 
                      ON DUPLICATE KEY UPDATE 
                      fileName = VALUES(fileName),
                      updated_date = NOW()`;

      //  const values =  [matchId, filePath ] ;
      await db.query(query);

      // Ball-by-ball data
      //   if (data.ball_event) {
      //     await connection.execute(
      //       `INSERT INTO ball_events
      //       (match_id, event, timestamp)
      //       VALUES (?, ?, NOW())`,
      //       [data.match_id, data.ball_event]
      //     );
      //   }

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
