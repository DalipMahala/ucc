// lib/redis.js
import Redis from 'ioredis';

if (typeof window !== "undefined") {
  throw new Error("ioredis should not be used on the client side.");
}
const redis = new Redis({
  host: 'localhost',   // The Redis server host (default: localhost)
  port: 6379,          // The Redis server port (default: 6379)
  // password: 'your-redis-password', // Uncomment if you set a password
});

export default redis;
