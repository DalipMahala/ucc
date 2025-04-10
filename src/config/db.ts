import * as mysql from 'mysql2/promise';


const db = mysql.createPool({
    host: 'localhost', // Your MySQL host
    user: 'root', // Your MySQL username
    password:'', // Your MySQL password
    database: 'uccricket', // Your database name
    waitForConnections: true,
    connectionLimit: 100,  // Limits concurrent connections
    queueLimit: 5000, // Higher queue for your cron jobs
    idleTimeout: 60000, // 1 minute idle timeout
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
});

export default db;