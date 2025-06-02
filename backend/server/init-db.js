const mongoose = require('mongoose');
const User = require('./models/user');
const Ticket = require('./models/ticket');
require('dotenv').config();

async function initializeDatabase() {
    try {
        console.log('🔍 Initializing database...');
        
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
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

        const createdUsers = await User.insertMany(users);
        console.log('✅ Created sample users');

        // Create sample tickets
        const tickets = [
            {
                ticketNumber: 'TICKET-000001',
                subject: "System Login Issue",
                description: "Unable to login to the system since morning",
                priority: "High",
                type: "Technical Issue",
                category: "Software",
                department: "IT",
                status: "Open",
                createdBy: createdUsers[2]._id, // Regular user
                assignedTo: createdUsers[1]._id, // Agent
                comments: [{
                    user: createdUsers[1]._id,
                    text: "Looking into this issue"
                }]
            },
            {
                ticketNumber: 'TICKET-000002',
                subject: "New Feature Request",
                description: "Need ability to export reports to PDF",
                priority: "Medium",
                type: "Feature Request",
                category: "Software",
                department: "IT",
                status: "In Progress",
                createdBy: createdUsers[2]._id,
                assignedTo: createdUsers[1]._id
            },
            {
                ticketNumber: 'TICKET-000003',
                subject: "Printer Not Working",
                description: "Office printer showing error code E-01",
                priority: "Low",
                type: "Bug",
                category: "Hardware",
                department: "IT",
                status: "Open",
                createdBy: createdUsers[2]._id
            }
        ];

        await Ticket.insertMany(tickets);
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