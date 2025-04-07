"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface MatchData {
  matchId:number;
}

const WebSocketContext = createContext<MatchData | null>(null);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [matchData, setMatchData] = useState<MatchData | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://webhook.entitysport.com:8087/connect?token=7b58d13da34a07b0a047e129874fdbf4");

    socket.onopen = () => console.log("✅ WebSocket Connected");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data).response;
      if (data?.match_id && data?.live?.live_inning?.batting_team_id) {
        // console.log("📩 WebSocket Data:", data);
        setMatchData({
          matchId: data,
        });
      }
    };

    socket.onclose = () => console.log("❌ WebSocket Disconnected");

    return () => socket.close();
  }, []);

  return (
    <WebSocketContext.Provider value={matchData}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
