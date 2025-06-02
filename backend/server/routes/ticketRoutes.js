const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  deleteTicket,
  addComment,
  assignTicket
} = require('../controllers/ticketController');

// Create a new ticket (any authenticated user can create)
router.post('/', auth, createTicket);

// Get all tickets (with filtering and pagination)
router.get('/', auth, getTickets);

// Get a single ticket
router.get('/:id', auth, getTicket);

// Update a ticket (only assigned agent or admin can update)
router.patch('/:id', auth, async (req, res, next) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    return res.status(404).json({ message: 'Ticket not found' });
  }
  
  if (req.user.role === 'admin' || 
      (req.user.role === 'agent' && ticket.assignedTo?.toString() === req.user._id.toString())) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
}, updateTicket);

// Delete a ticket (only admin can delete)
router.delete('/:id', auth, checkRole(['admin']), deleteTicket);

// Add a comment to a ticket
router.post('/:id/comments', auth, addComment);

// Assign ticket to an agent (only admin can assign)
router.post('/:id/assign', auth, checkRole(['admin']), assignTicket);

module.exports = router; 