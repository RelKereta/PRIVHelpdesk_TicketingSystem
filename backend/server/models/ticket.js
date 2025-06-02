// models/Ticket.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  author: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const attachmentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const ticketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Hardware', 'Software', 'Network', 'Account', 'Other']
  },
  priority: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    required: true,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  // User who created the ticket
  requester: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    department: {
      type: String,
      required: true
    }
  },
  // Agent assigned to the ticket
  assignee: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: {
      type: String
    }
  },
  comments: [commentSchema],
  attachments: [attachmentSchema],
  tags: [String],
  slaDeadline: {
    type: Date
  },
  resolvedAt: {
    type: Date
  },
  resolution: {
    type: String
  }
}, {
  timestamps: true
});

// Generate ticket number before saving
ticketSchema.pre('save', async function(next) {
  if (this.isNew && !this.ticketNumber) {
    try {
      const count = await this.constructor.countDocuments();
      this.ticketNumber = `TICKET-${String(count + 1).padStart(6, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Set SLA deadline based on priority
ticketSchema.pre('save', function(next) {
  if (this.isNew) {
    const now = new Date();
    switch (this.priority) {
      case 'Critical':
        this.slaDeadline = new Date(now.getTime() + (4 * 60 * 60 * 1000)); // 4 hours
        break;
      case 'High':
        this.slaDeadline = new Date(now.getTime() + (24 * 60 * 60 * 1000)); // 1 day
        break;
      case 'Medium':
        this.slaDeadline = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000)); // 3 days
        break;
      case 'Low':
        this.slaDeadline = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
        break;
    }
  }
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);
