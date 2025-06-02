require('dotenv').config();
const mongoose = require('mongoose');
const Solution = require('../models/solution');
const User = require('../models/user');

const connectDB = require('../config/connect');

const initializeSolutions = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Find an admin user to set as creator
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.error('No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    // Sample solutions data
    const solutions = [
      {
        title: 'Password Reset Guide',
        description: 'Step-by-step guide to reset your password for various company systems.',
        category: 'Account Management',
        content: 'Detailed instructions for password reset...',
        createdBy: adminUser._id
      },
      {
        title: 'VPN Setup Instructions',
        description: 'How to configure and connect to the company VPN from different devices.',
        category: 'Network',
        content: 'Complete VPN setup guide...',
        createdBy: adminUser._id
      },
      {
        title: 'Email Configuration',
        description: 'Setting up company email on various email clients and mobile devices.',
        category: 'Software',
        content: 'Email configuration steps...',
        createdBy: adminUser._id
      }
    ];

    // Clear existing solutions
    await Solution.deleteMany({});
    console.log('Cleared existing solutions');

    // Insert new solutions
    const createdSolutions = await Solution.insertMany(solutions);
    console.log('Created solutions:', createdSolutions);

    console.log('Solutions initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing solutions:', error);
    process.exit(1);
  }
};

initializeSolutions(); 