const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('🔍 Testing MongoDB Atlas connection...');
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB Atlas successfully');

        // Create a test user
        const testUser = new User({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
            department: 'IT',
            role: 'user'
        });

        await testUser.save();
        console.log('✅ Test user created successfully:', testUser);

        // Find the test user
        const foundUser = await User.findOne({ email: 'test@example.com' });
        console.log('✅ Test user retrieved successfully:', foundUser);

        // Clean up - remove test user
        await User.deleteOne({ email: 'test@example.com' });
        console.log('✅ Test user removed successfully');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('🛑 MongoDB connection closed');
    }
}

testConnection(); 