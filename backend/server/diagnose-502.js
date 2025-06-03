const mongoose = require('mongoose');
const axios = require('axios');
const config = require('./config/config');

console.log('🔍 Diagnosing 502 Error...\n');

// Test 1: Database Connection
async function testDatabaseConnection() {
  console.log('📊 Testing Database Connection...');
  console.log('MongoDB URI:', config.mongoUri);
  
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    });
    
    console.log('✅ Database connection successful');
    console.log('Database Name:', mongoose.connection.name);
    
    // Test if we can query the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Test users collection specifically
    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      username: String,
      role: String
    }));
    
    const userCount = await User.countDocuments();
    console.log(`Users in database: ${userCount}`);
    
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    console.log('Full error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

// Test 2: Server Startup
async function testServerStartup() {
  console.log('\n🚀 Testing Server Startup...');
  
  try {
    // Import and start server temporarily
    const express = require('express');
    const cors = require('cors');
    
    const app = express();
    app.use(cors(config.corsOptions));
    app.use(express.json());
    
    // Add a simple test route
    app.get('/test', (req, res) => {
      res.json({ message: 'Server is working', timestamp: new Date() });
    });
    
    const server = app.listen(3015, () => {
      console.log('✅ Test server started on port 3015');
    });
    
    // Test the server
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const response = await axios.get('http://localhost:3015/test', { timeout: 5000 });
      console.log('✅ Server response:', response.data);
    } catch (error) {
      console.log('❌ Server test failed:', error.message);
    }
    
    server.close();
    
  } catch (error) {
    console.log('❌ Server startup failed:', error.message);
  }
}

// Test 3: Environment Variables
function testEnvironmentVariables() {
  console.log('\n🔧 Testing Environment Variables...');
  
  const requiredEnvs = ['MONGO_URI', 'PORT', 'FRONTEND_URL'];
  
  requiredEnvs.forEach(env => {
    const value = process.env[env];
    if (value) {
      console.log(`✅ ${env}: ${env === 'MONGO_URI' ? '[HIDDEN]' : value}`);
    } else {
      console.log(`⚠️  ${env}: Not set (using default from config)`);
    }
  });
  
  console.log('\nConfig values:');
  console.log('Port:', config.port);
  console.log('Node Env:', config.nodeEnv);
  console.log('MongoDB URI:', config.mongoUri ? '[SET]' : '[NOT SET]');
}

// Run all tests
async function runDiagnostics() {
  testEnvironmentVariables();
  await testDatabaseConnection();
  await testServerStartup();
  
  console.log('\n💡 Troubleshooting Tips:');
  console.log('1. Make sure MongoDB server is running and accessible');
  console.log('2. Check if the MongoDB URI credentials are correct');
  console.log('3. Verify that port 3014 is not already in use');
  console.log('4. Check if there are any firewall issues blocking connections');
  console.log('5. Ensure all required npm packages are installed');
}

runDiagnostics().catch(console.error); 