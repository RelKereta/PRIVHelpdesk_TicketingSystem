// models/Ticket.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  priority: { type: String, required: true },
  type: { type: String, required: true },
  team: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: 'Open' },
  contact: { type: String, default: 'System Assigned' },
  createdDate: { type: Date, default: Date.now },
  resolvedDate: { type: Date },
  user: {
    userId: { type: String, default: 'dummy123' },
    username: { type: String, default: 'John Doe' }
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
