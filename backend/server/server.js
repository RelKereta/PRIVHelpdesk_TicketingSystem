require('dotenv').config(); // Load environment variables early
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <-- Import cors
const connectToDatabase = require('./connect');

const app = express();
const PORT = process.env.PORT || 3000;
const Ticket = require('./models/ticket');

// Middleware to parse JSON
app.use(cors());  // <-- Use cors middleware
app.use(express.json());

// Connect to DB
(async () => {
  await connectToDatabase();

  // POST route for creating a ticket
  app.post('/api/tickets', async (req, res) => {
    try {
      const ticket = new Ticket(req.body);
      await ticket.save();
      res.status(201).json(ticket);
    } catch (error) {
      console.error('Error creating ticket:', error);
      res.status(400).json({ message: error.message });
    }
  });

  // Example route
  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
})();

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 MongoDB connection closed.');
  process.exit(0);
});


// require('dotenv').config(); // Load environment variables early
// const express = require('express');
// const mongoose = require('mongoose');
// const request = require('supertest');
// const connectToDatabase = require('./connect');

// const app = express();
// const PORT = process.env.PORT || 3000;
// const Ticket = require('./models/ticket');

// // Middleware to parse JSON
// app.use(express.json());

// // Connect to DB
// (async () => {
//   await connectToDatabase();

//   // POST route for creating a ticket
//   app.post('/api/tickets', async (req, res) => {
//     try {
//       const ticket = new Ticket(req.body);
//       await ticket.save();
//       res.status(201).json(ticket);
//     } catch (error) {
//       console.error('Error creating ticket:', error);
//       res.status(400).json({ message: error.message });
//     }
//   });

//   // Example route
//   app.get('/', (req, res) => {
//     res.send('Hello, World!');
//   });

//   // Add a route to handle running tests
//   app.get('/test', async (req, res) => {
//     // Run simple POST request test for the ticket route
//     try {
//       const response = await request(app)
//         .post('/api/tickets')
//         .send({
//           subject: 'Test Ticket',
//           priority: 'High',
//           type: 'Bug',
//           team: 'IT Support',
//           description: 'Testing ticket creation'
//         })
//         .set('Content-Type', 'application/json');

//       res.json({
//         status: response.status,
//         body: response.body
//       });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });

//   // Start the server
//   app.listen(PORT, () => {
//     console.log(`🚀 Server is running on port ${PORT}`);
//   });
// })();

// // Graceful shutdown
// process.on('SIGINT', async () => {
//   await mongoose.connection.close();
//   console.log('🛑 MongoDB connection closed.');
//   process.exit(0);
// });
