const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

// Get all tickets
router.get('/', ticketController.getTickets);

// Get a single ticket
router.get('/:id', ticketController.getTicketById);

// Create a new ticket
router.post('/', ticketController.createTicket);

// Update a ticket
router.put('/:id', ticketController.updateTicket);

// Delete a ticket (admin only)
router.delete('/:id', ticketController.deleteTicket);

// Add a comment to a ticket
router.post('/:id/comments', ticketController.addComment);

// Resolve a ticket
router.post('/:id/resolve', ticketController.resolveTicket);

// Assign a ticket
router.post('/:id/assign', ticketController.assignTicket);

module.exports = router; 