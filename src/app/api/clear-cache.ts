import type { NextApiRequest, NextApiResponse } from "next";
import redis from "@/config/redis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await redis.flushall(); // Clears the entire Redis cache
    res.status(200).json({ message: "Redis cache cleared successfully!" });
  } catch (error) {
    console.error("Error clearing Redis cache:", error);
    res.status(500).json({ message: "Failed to clear Redis cache" });
  }
}
