const mysql = require('mysql2/promise');

// Create a function to initialize and return the database connection
async function initializeConnection() {
    try {
        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'Snehal',
            password: 'Snehal@123',
            database: 'apistore'
        });
        console.log('Successfully connected to the MySQL database.');
        return connection;
    } catch (err) {
        console.error('Failed to connect to the database:', err);
        throw err;
    }
}

// Export the function that initializes the connection
module.exports = initializeConnection;
