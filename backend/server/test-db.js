const mongoose = require('mongoose');
const User = require('./models/user');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('🔍 Testing MongoDB connection...');
        
        // Connect to MongoDB using the correct env variable
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB successfully');

        // Check existing users
        const users = await User.find({});
        console.log(`\n📊 Found ${users.length} users in database:`);
        
        users.forEach((user, index) => {
            console.log(`\n👤 User ${index + 1}:`);
            console.log(`  Username: ${user.username}`);
            console.log(`  Email: ${user.email}`);
            console.log(`  Role: ${user.role}`);
            console.log(`  Has password: ${user.password ? 'Yes' : 'No'}`);
            console.log(`  Password length: ${user.password ? user.password.length : 0}`);
        });

        // Test authentication with admin user
        const adminUser = await User.findOne({ email: 'admin@priv.com' });
        if (adminUser) {
            console.log('\n🔐 Testing admin authentication:');
            try {
                const isValidPassword = await adminUser.comparePassword('admin123');
                console.log(`  ✅ Password "admin123" is valid: ${isValidPassword}`);
                
                // Also test a wrong password
                const isInvalidPassword = await adminUser.comparePassword('wrongpassword');
                console.log(`  ❌ Password "wrongpassword" is valid: ${isInvalidPassword}`);
            } catch (error) {
                console.log(`  ❌ Password comparison error: ${error.message}`);
            }
        } else {
            console.log('\n❌ Admin user not found');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('\n🛑 MongoDB connection closed');
    }
}

testConnection(); 