const mongoose = require('mongoose');
const User = require('./models/user');
const Ticket = require('./models/ticket');
require('dotenv').config();

async function initializeDatabase() {
    try {
        console.log('🔍 Initializing database...');
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB successfully');

        // Clear existing data
        await User.deleteMany({});
        await Ticket.deleteMany({});
        console.log('✅ Cleared existing data');

        // Create sample users
        const users = [
            {
                username: 'admin',
                email: 'admin@priv.com',
                password: 'admin123',
                firstName: 'Admin',
                lastName: 'User',
                department: 'IT',
                role: 'admin'
            },
            {
                username: 'agent1',
                email: 'agent1@priv.com',
                password: 'agent123',
                firstName: 'John',
                lastName: 'Agent',
                department: 'IT',
                role: 'agent'
            },
            {
                username: 'user1',
                email: 'user1@priv.com',
                password: 'user123',
                firstName: 'Regular',
                lastName: 'User',
                department: 'HR',
                role: 'user'
            }
        ];

        // Create users one by one to ensure pre-save middleware works for password hashing
        const createdUsers = [];
        for (const userData of users) {
            const user = new User(userData);
            await user.save();
            createdUsers.push(user);
        }
        console.log('✅ Created sample users');

        // Create sample tickets
        const tickets = [
            {
                title: "System Login Issue",
                description: "Unable to login to the system since morning",
                priority: "High",
                category: "Software",
                status: "Open",
                requester: {
                    userId: createdUsers[2]._id,
                    username: createdUsers[2].username,
                    email: createdUsers[2].email,
                    department: createdUsers[2].department
                },
                assignee: {
                    userId: createdUsers[1]._id,
                    username: createdUsers[1].username
                },
                comments: [{
                    text: "Looking into this issue",
                    author: {
                        userId: createdUsers[1]._id,
                        username: createdUsers[1].username
                    }
                }]
            },
            {
                title: "New Feature Request",
                description: "Need ability to export reports to PDF",
                priority: "Medium",
                category: "Software",
                status: "In Progress",
                requester: {
                    userId: createdUsers[2]._id,
                    username: createdUsers[2].username,
                    email: createdUsers[2].email,
                    department: createdUsers[2].department
                },
                assignee: {
                    userId: createdUsers[1]._id,
                    username: createdUsers[1].username
                }
            },
            {
                title: "Printer Not Working",
                description: "Office printer showing error code E-01",
                priority: "Low",
                category: "Hardware",
                status: "Open",
                requester: {
                    userId: createdUsers[2]._id,
                    username: createdUsers[2].username,
                    email: createdUsers[2].email,
                    department: createdUsers[2].department
                }
            }
        ];

        // Create tickets one by one to ensure pre-save middleware works
        for (const ticketData of tickets) {
            const ticket = new Ticket(ticketData);
            await ticket.save();
        }
        console.log('✅ Created sample tickets');

        // Verify data
        const userCount = await User.countDocuments();
        const ticketCount = await Ticket.countDocuments();
        console.log(`\n📊 Database Statistics:`);
        console.log(`Users: ${userCount}`);
        console.log(`Tickets: ${ticketCount}`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🛑 MongoDB connection closed');
    }
}

initializeDatabase(); 