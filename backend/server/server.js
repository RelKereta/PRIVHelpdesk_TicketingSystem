require('dotenv').config(); // Load environment variables early
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // <-- Import cors
const connectToDatabase = require('./connect');

const app = express();
const PORT = process.env.PORT || 3000;
const Ticket = require('./models/ticket');
const User = require('./models/user');
const User1 = require('./models/user1');

// Middleware to parse JSON
app.use(cors());  // <-- Use cors middleware
app.use(express.json());

// Connect to DB
(async () => {
  await connectToDatabase();

  // Login Route
  app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User1.findOne({ email });



      // Check if user exists and password matches
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // If login successful, return user data without password
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      
      res.json({
        message: 'Login successful',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // User1 Routes
  // Get all user1s
  app.get('/api/user1s', async (req, res) => {
    try {
      const user1s = await User1.find({}, { password: 0 }); // Exclude password from response
      res.json(user1s);
    } catch (error) {
      console.error('Error fetching user1s:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get a single user1 by employeeId
  app.get('/api/user1s/:employeeId', async (req, res) => {
    try {
      const user1 = await User1.findOne({ employeeId: req.params.employeeId }, { password: 0 });
      if (!user1) {
        return res.status(404).json({ message: 'User1 not found' });
      }
      res.json(user1);
    } catch (error) {
      console.error('Error fetching user1:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Create a new user1
  app.post('/api/user1s', async (req, res) => {
    try {
      const user1 = new User1(req.body);
      await user1.save();
      const user1WithoutPassword = user1.toObject();
      delete user1WithoutPassword.password;
      res.status(201).json(user1WithoutPassword);
    } catch (error) {
      console.error('Error creating user1:', error);
      res.status(400).json({ message: error.message });
    }
  });

  // Update a user1
  app.put('/api/user1s/:employeeId', async (req, res) => {
    try {
      const user1 = await User1.findOneAndUpdate(
        { employeeId: req.params.employeeId },
        req.body,
        { new: true, runValidators: true }
      );
      if (!user1) {
        return res.status(404).json({ message: 'User1 not found' });
      }
      const user1WithoutPassword = user1.toObject();
      delete user1WithoutPassword.password;
      res.json(user1WithoutPassword);
    } catch (error) {
      console.error('Error updating user1:', error);
      res.status(400).json({ message: error.message });
    }
  });

  // Delete a user1
  app.delete('/api/user1s/:employeeId', async (req, res) => {
    try {
      const user1 = await User1.findOneAndDelete({ employeeId: req.params.employeeId });
      if (!user1) {
        return res.status(404).json({ message: 'User1 not found' });
      }
      res.json({ message: 'User1 deleted successfully' });
    } catch (error) {
      console.error('Error deleting user1:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // User Routes
  // Get all users
  app.get('/api/users', async (req, res) => {
    try {
      const users = await User.find({}, { password: 0 }); // Exclude password from response
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Get a single user by email
  app.get('/api/users/:email', async (req, res) => {
    try {
      const user = await User.findOne({ email: req.params.email }, { password: 0 });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Create a new user
  app.post('/api/users', async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(400).json({ message: error.message });
    }
  });

  // Update a user
  app.put('/api/users/:email', async (req, res) => {
    try {
      const user = await User.findOneAndUpdate(
        { email: req.params.email },
        req.body,
        { new: true, runValidators: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(400).json({ message: error.message });
    }
  });

  // Delete a user
  app.delete('/api/users/:email', async (req, res) => {
    try {
      const user = await User.findOneAndDelete({ email: req.params.email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: error.message });
    }
  });

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
