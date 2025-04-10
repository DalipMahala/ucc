import * as mysql from 'mysql2/promise';


const db = mysql.createPool({
    host: 'localhost', // Your MySQL host
    user: 'root', // Your MySQL username
    password:'', // Your MySQL password
    database: 'uccricket', // Your database name
    waitForConnections: true,
    connectionLimit: 100,  // Limits concurrent connections
    queueLimit: 0
});




export default db;