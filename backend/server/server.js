require('dotenv').config(); // Load environment variables early
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/connect');
const ticketRoutes = require('./routes/ticketRoutes');
const userRoutes = require('./routes/userRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const fileRoutes = require('./routes/fileRoutes');
const healthRoutes = require('./routes/healthRoutes');
const config = require('./config/config');
const solutionRoutes = require('./routes/solutionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const Ticket = require('./models/ticket');

// Middleware to parse JSON
app.use(cors(config.corsOptions));  // Use configured CORS options
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/solutions', solutionRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.stack
  });
});

// Connect to DB
(async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
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
