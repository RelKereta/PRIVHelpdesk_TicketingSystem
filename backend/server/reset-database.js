const mongoose = require('mongoose');
const User = require('./models/user');
const Ticket = require('./models/ticket');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error);
    process.exit(1);
  }
};

const resetDatabase = async () => {
  try {
    console.log('🗑️  Clearing existing data...');
    
    // Drop collections completely to remove any indexes
    try {
      await mongoose.connection.db.dropCollection('tickets');
      console.log('✓ Dropped tickets collection');
    } catch (error) {
      console.log('- Tickets collection does not exist');
    }
    
    try {
      await mongoose.connection.db.dropCollection('users');
      console.log('✓ Dropped users collection');
    } catch (error) {
      console.log('- Users collection does not exist');
    }
    
    console.log('✓ Existing data cleared');
    
    console.log('👥 Creating users...');
    
    // Create sample users
    const users = await User.create([
      {
        username: 'admin',
        email: 'admin@priv.com',
        password: 'admin123',
        firstName: 'System',
        lastName: 'Administrator',
        role: 'admin',
        department: 'IT',
        bio: 'System administrator with full access',
        createdTickets: [],
        assignedTickets: []
      },
      {
        username: 'tech1',
        email: 'tech1@priv.com',
        password: 'tech123',
        firstName: 'John',
        lastName: 'Smith',
        role: 'agent',
        department: 'IT',
        bio: 'Senior IT technician specializing in hardware and network issues',
        createdTickets: [],
        assignedTickets: []
      },
      {
        username: 'tech2',
        email: 'tech2@priv.com',
        password: 'tech123',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'agent',
        department: 'IT',
        bio: 'Software specialist and security expert',
        createdTickets: [],
        assignedTickets: []
      },
      {
        username: 'user1',
        email: 'user1@priv.com',
        password: 'user123',
        firstName: 'Mike',
        lastName: 'Davis',
        role: 'user',
        department: 'HR',
        bio: 'HR manager handling employee relations',
        createdTickets: [],
        assignedTickets: []
      },
      {
        username: 'user2',
        email: 'user2@priv.com',
        password: 'user123',
        firstName: 'Lisa',
        lastName: 'Wilson',
        role: 'user',
        department: 'Finance',
        bio: 'Finance analyst working with accounting software',
        createdTickets: [],
        assignedTickets: []
      },
      {
        username: 'user3',
        email: 'user3@priv.com',
        password: 'user123',
        firstName: 'Robert',
        lastName: 'Brown',
        role: 'user',
        department: 'Operations',
        bio: 'Operations coordinator managing daily workflows',
        createdTickets: [],
        assignedTickets: []
      }
    ]);
    
    console.log(`✓ Created ${users.length} users`);
    
    console.log('🎫 Creating tickets...');
    
    // Get users for ticket creation
    const admin = users.find(u => u.username === 'admin');
    const tech1 = users.find(u => u.username === 'tech1');
    const tech2 = users.find(u => u.username === 'tech2');
    const user1 = users.find(u => u.username === 'user1');
    const user2 = users.find(u => u.username === 'user2');
    const user3 = users.find(u => u.username === 'user3');
    
    // Create tickets one by one to handle ticketNumber generation properly
    const ticketData = [
      {
        title: 'Computer Won\'t Start',
        description: 'My workstation computer won\'t power on this morning. The power button doesn\'t respond and there are no lights.',
        category: 'Hardware',
        priority: 'High',
        status: 'Open',
        requester: {
          userId: user1._id,
          username: user1.username,
          email: user1.email,
          department: user1.department
        },
        comments: [
          {
            text: 'I\'ve tried unplugging and plugging it back in, but still no response.',
            author: {
              userId: user1._id,
              username: user1.username
            }
          }
        ],
        tags: ['hardware', 'urgent', 'workstation']
      },
      {
        title: 'Email Access Issues',
        description: 'Unable to access company email. Getting authentication errors when trying to log in.',
        category: 'Software',
        priority: 'Medium',
        status: 'In Progress',
        requester: {
          userId: user2._id,
          username: user2.username,
          email: user2.email,
          department: user2.department
        },
        assignee: {
          userId: tech2._id,
          username: tech2.username
        },
        comments: [
          {
            text: 'Started happening after the weekend. Was working fine on Friday.',
            author: {
              userId: user2._id,
              username: user2.username
            }
          },
          {
            text: 'Checking your account settings. Please try resetting your password.',
            author: {
              userId: tech2._id,
              username: tech2.username
            }
          }
        ],
        tags: ['email', 'authentication', 'finance']
      },
      {
        title: 'Printer Not Working',
        description: 'The shared printer in the operations department is not responding to print jobs.',
        category: 'Hardware',
        priority: 'Medium',
        status: 'Open',
        requester: {
          userId: user3._id,
          username: user3.username,
          email: user3.email,
          department: user3.department
        },
        comments: [
          {
            text: 'Paper is loaded and toner seems fine. Print jobs just sit in queue.',
            author: {
              userId: user3._id,
              username: user3.username
            }
          }
        ],
        tags: ['printer', 'hardware', 'operations']
      },
      {
        title: 'VPN Connection Problems',
        description: 'Cannot connect to company VPN from home. Connection times out.',
        category: 'Network',
        priority: 'High',
        status: 'In Progress',
        requester: {
          userId: user1._id,
          username: user1.username,
          email: user1.email,
          department: user1.department
        },
        assignee: {
          userId: tech1._id,
          username: tech1.username
        },
        comments: [
          {
            text: 'Worked fine last week. Nothing changed on my end.',
            author: {
              userId: user1._id,
              username: user1.username
            }
          },
          {
            text: 'Checking server logs. Can you try connecting at different times?',
            author: {
              userId: tech1._id,
              username: tech1.username
            }
          }
        ],
        tags: ['vpn', 'network', 'remote-work']
      },
      {
        title: 'Software Installation Request',
        description: 'Need Adobe Acrobat Pro installed for document processing in Finance department.',
        category: 'Software',
        priority: 'Low',
        status: 'Open',
        requester: {
          userId: user2._id,
          username: user2.username,
          email: user2.email,
          department: user2.department
        },
        comments: [
          {
            text: 'This is needed for the quarterly reports processing.',
            author: {
              userId: user2._id,
              username: user2.username
            }
          }
        ],
        tags: ['software', 'installation', 'adobe', 'finance']
      },
      {
        title: 'Password Reset Required',
        description: 'Need to reset password for the HR management system. Current password expired.',
        category: 'Account',
        priority: 'Medium',
        status: 'Resolved',
        requester: {
          userId: user1._id,
          username: user1.username,
          email: user1.email,
          department: user1.department
        },
        assignee: {
          userId: admin._id,
          username: admin.username
        },
        resolution: 'Password reset completed. New temporary password sent via secure email.',
        resolvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Resolved yesterday
        comments: [
          {
            text: 'Password expired this morning, cannot access employee records.',
            author: {
              userId: user1._id,
              username: user1.username
            }
          },
          {
            text: 'Password reset completed. Please check your email for the new temporary password.',
            author: {
              userId: admin._id,
              username: admin.username
            }
          }
        ],
        tags: ['password', 'hr-system', 'account']
      }
    ];
    
    const tickets = [];
    for (const data of ticketData) {
      const ticket = new Ticket(data);
      await ticket.save();
      tickets.push(ticket);
      console.log(`✓ Created ticket: ${ticket.ticketNumber} - ${ticket.title}`);
    }
    
    console.log(`✓ Created ${tickets.length} tickets`);
    
    console.log('🔗 Updating user-ticket relationships...');
    
    // Update users with their ticket references
    for (const ticket of tickets) {
      // Add ticket to requester's createdTickets
      const requester = await User.findById(ticket.requester.userId);
      if (requester) {
        await requester.addCreatedTicket(ticket);
      }
      
      // Add ticket to assignee's assignedTickets if assigned
      if (ticket.assignee && ticket.assignee.userId) {
        const assignee = await User.findById(ticket.assignee.userId);
        if (assignee) {
          await assignee.addAssignedTicket(ticket);
        }
      }
    }
    
    console.log('✓ User-ticket relationships updated');
    
    // Display summary
    console.log('\n📊 Database Reset Summary:');
    console.log(`👥 Users created: ${users.length}`);
    console.log(`🎫 Tickets created: ${tickets.length}`);
    
    console.log('\n👥 User Accounts:');
    users.forEach(user => {
      console.log(`  • ${user.username} (${user.email}) - ${user.role} - ${user.department}`);
    });
    
    console.log('\n🎫 Tickets Created:');
    tickets.forEach(ticket => {
      console.log(`  • ${ticket.ticketNumber}: ${ticket.title} - ${ticket.status} (${ticket.priority})`);
      console.log(`    Requester: ${ticket.requester.username} (${ticket.requester.department})`);
      if (ticket.assignee && ticket.assignee.username) {
        console.log(`    Assigned to: ${ticket.assignee.username}`);
      }
    });
    
    console.log('\n✅ Database reset completed successfully!');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
  }
};

const main = async () => {
  await connectDB();
  await resetDatabase();
  await mongoose.connection.close();
  console.log('\n🔐 Database connection closed');
  process.exit(0);
};

main(); 