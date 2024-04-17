const express = require('express');
const app = express();
app.use(express.json());
const getDatabaseConnection = require('./db');

const authRoute=(require('./routes/authRoutes'))
app.use("/auth",authRoute)
// Middleware to parse JSON request bodies


// API to add data in channel table
app.post('/api/channels', async(req, res) => {
  const connection = await getDatabaseConnection();
  const { name } = req.body;
  const query = 'INSERT INTO channel (name) VALUES (?)';
  connection.query(query, [name], (err, result) => {
    if (err) throw err;
    res.send(`Channel created with ID: ${result.insertId}`);
  });
});

// API to add data in message table
app.post('/api/messages/:channelId', async (req, res) => {
  let connection;
  try {
    // Establishing a connection to the database
    connection = await getDatabaseConnection();
    
    const { message_content } = req.body;
    const { channelId } = req.params;
    
    // SQL query to insert the new message
    const query = 'INSERT INTO messages (message_content, channel_id) VALUES (?, ?)';
    
    // Executing the query
    const [result] = await connection.query(query, [message_content, channelId]);
    
    // Sending a response back to the client with the ID of the new message
    res.send(`Message added with ID: ${result.insertId}`);
  } catch (err) {
    // Error handling
    console.error('Failed to add message:', err);
    res.status(500).send('Failed to add message');
  } finally {
    // Ensuring that the database connection is closed
    if (connection) {
      await connection.end();
    }
  }
});


// API to fetch messages for a specific channel
app.get('/api/messages/:channelId', async (req, res) => {
  let connection;
  try {
    connection = await getDatabaseConnection();  // Ensure you get a connection
    const { channelId } = req.params;
    const query = 'SELECT * FROM messages WHERE channel_id = ?';
    const [results] = await connection.query(query, [channelId]);  // Directly await the promise
    res.json(results);
  } catch (err) {
    console.error('Failed to execute query:', err);
    res.status(500).send('Internal Server Error');
  } finally {
    if (connection) {
      await connection.end();  // Properly close the connection in a finally block
    }
  }
});




























// GET route to fetch all users
app.get('/api/users', (req, res) => {
  const query = 'SELECT * FROM users';
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});


app.post('/api/users', (req, res) => {
  const { name, email, mobile } = req.body;
  const query = 'INSERT INTO users (name, email, mobile) VALUES (?, ?, ?)';
  connection.query(query, [name, email, mobile], (err, result) => {
    if (err) throw err;
    res.send(`User added with ID: ${result.insertId}`);
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});