const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'agent', 'admin'],
    default: 'user'
  },
  department: {
    type: String,
    required: true,
    enum: ['IT', 'HR', 'Finance', 'Operations', 'Marketing', 'Sales', 'Other']
  },
  phone: {
    type: String,
    trim: true
  },
  position: {
    type: String,
    trim: true
  },
  // Tickets created by this user
  createdTickets: [{
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket'
    },
    ticketNumber: String,
    title: String,
    status: String,
    priority: String,
    createdAt: Date
  }],
  // Tickets assigned to this user (for agents/admins)
  assignedTickets: [{
    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket'
    },
    ticketNumber: String,
    title: String,
    status: String,
    priority: String,
    assignedAt: Date
  }],
  lastLogin: {
    type: Date
  },
  profilePicture: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with salt rounds
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Helper methods
userSchema.methods.hasPermission = function(permission) {
  const permissions = this.getPermissions();
  return permissions[permission] === true;
};

userSchema.methods.getPermissions = function() {
  switch (this.role) {
    case 'admin':
      return {
        canCreateTickets: true,
        canViewAllTickets: true,
        canAssignTickets: true,
        canDeleteTickets: true,
        canManageUsers: true
      };
    case 'agent':
      return {
        canCreateTickets: true,
        canViewAllTickets: true,
        canAssignTickets: true,
        canDeleteTickets: false,
        canManageUsers: false
      };
    case 'user':
    default:
      return {
        canCreateTickets: true,
        canViewAllTickets: false,
        canAssignTickets: false,
        canDeleteTickets: false,
        canManageUsers: false
      };
  }
};

userSchema.methods.canAccessTicket = function(ticket) {
  // Admin can access all tickets
  if (this.role === 'admin') {
    return true;
  }
  // Agent can access all tickets (they have canViewAllTickets permission)
  if (this.role === 'agent') {
    return true;
  }
  // User can access their own tickets
  if (ticket.requester.userId.toString() === this._id.toString()) {
    return true;
  }
  // Agent/Admin can access assigned tickets (redundant now but keeping for clarity)
  if (ticket.assignee && ticket.assignee.userId && ticket.assignee.userId.toString() === this._id.toString()) {
    return true;
  }
  return false;
};

userSchema.methods.addCreatedTicket = function(ticket) {
  this.createdTickets.push({
    ticketId: ticket._id,
    ticketNumber: ticket.ticketNumber,
    title: ticket.title,
    status: ticket.status,
    priority: ticket.priority,
    createdAt: ticket.createdAt
  });
  return this.save();
};

userSchema.methods.addAssignedTicket = function(ticket) {
  this.assignedTickets.push({
    ticketId: ticket._id,
    ticketNumber: ticket.ticketNumber,
    title: ticket.title,
    status: ticket.status,
    priority: ticket.priority,
    assignedAt: new Date()
  });
  return this.save();
};

userSchema.methods.updateTicketStatus = function(ticketId, newStatus) {
  // Update in created tickets
  const createdTicket = this.createdTickets.find(t => t.ticketId.toString() === ticketId.toString());
  if (createdTicket) {
    createdTicket.status = newStatus;
  }
  // Update in assigned tickets
  const assignedTicket = this.assignedTickets.find(t => t.ticketId.toString() === ticketId.toString());
  if (assignedTicket) {
    assignedTicket.status = newStatus;
  }
  return this.save();
};

// Method to compare password with hashed password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('User', userSchema); 