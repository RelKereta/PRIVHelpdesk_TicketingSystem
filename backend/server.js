// server.js
require('dotenv').config(); // Load environment variables early
const express = require('express');
const mongoose = require('mongoose'); // <-- you forgot to import this
const connectToDatabase = require('./connect');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

(async () => {
    // Connect to the database before starting the server
    await connectToDatabase();

    // Example route
    app.get('/', (req, res) => {
        res.send('Hello, World!');
    });

    // Start the server only after successful DB connection
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
})();

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log("🛑 MongoDB connection closed.");
    process.exit(0);
});
