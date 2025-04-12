import * as mysql from 'mysql2/promise';

declare global {
    // Allow reuse of the global object
    var db: mysql.Pool | undefined;
  }

  const db = global.db || mysql.createPool({
    host: '13.202.213.65', // Your MySQL host
    user: 'ucc', // Your MySQL username
    password:'Ucc@2025', // Your MySQL password
    database: 'uccricket', // Your database name
    waitForConnections: true,
    connectionLimit: 100,  // Limits concurrent connections
    queueLimit: 5000, // Higher queue for your cron jobs
    idleTimeout: 60000, // 1 minute idle timeout
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
});

if (process.env.NODE_ENV !== 'production') global.db = db;

export default db;