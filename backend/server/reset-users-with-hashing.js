const mongoose = require('mongoose');
const User = require('./models/user');
const Ticket = require('./models/ticket');
const connectDB = require('./config/connect');
require('dotenv').config();

const resetUsersWithHashing = async () => {
  try {
    console.log('🗑️  Deleting all existing users...');
    
    // Delete all existing users
    await User.deleteMany({});
    console.log('✓ All users deleted');
    
    console.log('👥 Creating new users with hashed passwords...');
    
    // Create 3 new users with different roles
    // Note: The password will be automatically hashed by the pre-save middleware
    const users = await User.create([
      {
        username: 'admin',
        email: 'admin@priv.com',
        password: 'admin123', // This will be hashed automatically
        firstName: 'System',
        lastName: 'Administrator',
        role: 'admin',
        department: 'IT',
        bio: 'System administrator with full access',
        createdTickets: [],
        assignedTickets: []
      },
      {
        username: 'agent',
        email: 'agent@priv.com',
        password: 'agent123', // This will be hashed automatically
        firstName: 'John',
        lastName: 'Smith',
        role: 'agent',
        department: 'IT',
        bio: 'IT support agent handling tickets and technical issues',
        createdTickets: [],
        assignedTickets: []
      },
      {
        username: 'user',
        email: 'user@priv.com',
        password: 'user123', // This will be hashed automatically
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'user',
        department: 'HR',
        bio: 'Regular user who creates support tickets',
        createdTickets: [],
        assignedTickets: []
      }
    ]);
    
    console.log(`✓ Created ${users.length} users with hashed passwords`);
    console.log('Users created:');
    users.forEach(user => {
      console.log(`  - ${user.username} (${user.role}) - ${user.email}`);
    });
    
    console.log('🎫 Updating existing tickets to reference new users...');
    
    // Get the new users
    const admin = users.find(u => u.username === 'admin');
    const agent = users.find(u => u.username === 'agent');
    const user = users.find(u => u.username === 'user');
    
    // Get all existing tickets
    const tickets = await Ticket.find({});
    console.log(`Found ${tickets.length} existing tickets to update`);
    
    let updatedCount = 0;
    
    for (const ticket of tickets) {
      let updated = false;
      
      // Randomly assign requesters and assignees to new users
      const randomRequester = Math.random() < 0.5 ? user : (Math.random() < 0.5 ? admin : agent);
      const randomAssignee = Math.random() < 0.5 ? agent : admin; // Only agents and admins can be assignees
      
      // Update requester
      ticket.requester = {
        userId: randomRequester._id,
        username: randomRequester.username,
        email: randomRequester.email,
        department: randomRequester.department
      };
      updated = true;
      
      // Update assignee if ticket has one
      if (ticket.assignee && ticket.assignee.userId) {
        ticket.assignee = {
          userId: randomAssignee._id,
          username: randomAssignee.username
        };
        updated = true;
      }
      
      // Update comment authors to reference new users
      if (ticket.comments && ticket.comments.length > 0) {
        ticket.comments.forEach(comment => {
          const randomAuthor = Math.random() < 0.5 ? randomRequester : randomAssignee;
          comment.author = {
            userId: randomAuthor._id,
            username: randomAuthor.username
          };
        });
        updated = true;
      }
      
      if (updated) {
        await ticket.save();
        updatedCount++;
      }
    }
    
    console.log(`✓ Updated ${updatedCount} tickets`);
    
    console.log('\n🎉 Reset complete!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@priv.com / admin123');
    console.log('Agent: agent@priv.com / agent123');
    console.log('User:  user@priv.com / user123');
    console.log('\nNote: All passwords are now securely hashed in the database.');
    
  } catch (error) {
    console.error('Error resetting users:', error);
  }
};

const main = async () => {
  await connectDB();
  await resetUsersWithHashing();
  await mongoose.connection.close();
  console.log('✓ Database connection closed');
  process.exit(0);
};

main().catch(console.error); 