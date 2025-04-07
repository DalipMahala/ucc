import * as mysql from 'mysql2/promise';


const db = mysql.createPool({
    host: '13.232.110.98', // Your MySQL host
    user: 'ucc', // Your MySQL username
    password:'Ucc@2025', // Your MySQL password
    database: 'uccricket', // Your database name
    waitForConnections: true,
    connectionLimit: 100,  // Limits concurrent connections
    queueLimit: 0
});




export default db;