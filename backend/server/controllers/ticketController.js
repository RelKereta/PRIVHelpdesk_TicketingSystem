const Ticket = require('../models/ticket');
const User = require('../models/user');

// Create a new ticket
const createTicket = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    
    // Get the authenticated user
    const userId = req.headers['x-user-id'];
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const ticketData = {
      title,
      description,
      category,
      priority: priority || 'Medium',
      requester: {
        userId: user._id,
        username: user.username,
        email: user.email,
        department: user.department
      }
    };

    const ticket = new Ticket(ticketData);
    await ticket.save();

    // Add ticket to user's createdTickets
    await user.addCreatedTicket(ticket);

    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Error creating ticket', error: error.message });
  }
};

// Get all tickets (with filtering based on user role)
const getTickets = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let query = {};

    // Filter tickets based on user role
    if (user.role === 'user') {
      // Users can only see their own tickets
      query['requester.userId'] = user._id;
    } else if (user.role === 'agent') {
      // Agents can see tickets in their department or assigned to them
      query = {
        $or: [
          { 'requester.department': user.department },
          { 'assignee.userId': user._id }
        ]
      };
    }
    // Admins can see all tickets (no filter)

    const tickets = await Ticket.find(query).sort({ createdAt: -1 });

    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Error fetching tickets', error: error.message });
  }
};

// Get a single ticket by ID
const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'];
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const ticket = await Ticket.findById(id)
      .populate('requester.userId', 'firstName lastName email department')
      .populate('assignee.userId', 'firstName lastName email')
      .populate('comments.author.userId', 'firstName lastName');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user can access this ticket
    if (!user.canAccessTicket(ticket)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ message: 'Error fetching ticket', error: error.message });
  }
};

// Update a ticket
const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'];
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check permissions
    if (!user.canAccessTicket(ticket) && user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updates = { ...req.body };
    
    // Update ticket
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        ticket[key] = updates[key];
      }
    });

    await ticket.save();

    // Update ticket status in user records if status changed
    if (req.body.status) {
      await User.updateMany(
        {
          $or: [
            { 'createdTickets.ticketId': ticket._id },
            { 'assignedTickets.ticketId': ticket._id }
          ]
        },
        {
          $set: {
            'createdTickets.$[created].status': req.body.status,
            'assignedTickets.$[assigned].status': req.body.status
          }
        },
        {
          arrayFilters: [
            { 'created.ticketId': ticket._id },
            { 'assigned.ticketId': ticket._id }
          ]
        }
      );
    }

    res.json(ticket);
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ message: 'Error updating ticket', error: error.message });
  }
};

// Assign a ticket to an agent
const assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { assigneeId } = req.body;
    const userId = req.headers['x-user-id'];
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user can assign tickets
    if (!user.hasPermission('canAssignTickets')) {
      return res.status(403).json({ message: 'Permission denied: Cannot assign tickets' });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    const assignee = await User.findById(assigneeId);
    if (!assignee) {
      return res.status(404).json({ message: 'Assignee not found' });
    }

    // Check if assignee is an agent or admin
    if (assignee.role === 'user') {
      return res.status(400).json({ message: 'Cannot assign ticket to regular user' });
    }

    // Update ticket assignment
    ticket.assignee = {
      userId: assignee._id,
      username: assignee.username
    };
    
    if (ticket.status === 'Open') {
      ticket.status = 'In Progress';
    }

    await ticket.save();

    // Add ticket to assignee's assignedTickets
    await assignee.addAssignedTicket(ticket);

    res.json(ticket);
  } catch (error) {
    console.error('Error assigning ticket:', error);
    res.status(500).json({ message: 'Error assigning ticket', error: error.message });
  }
};

// Add a comment to a ticket
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.headers['x-user-id'];
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check if user can access this ticket
    if (!user.canAccessTicket(ticket)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const comment = {
      text,
      author: {
        userId: user._id,
        username: user.username
      }
    };

    ticket.comments.push(comment);
    await ticket.save();

    res.json(ticket);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

// Resolve a ticket
const resolveTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;
    const userId = req.headers['x-user-id'];
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Only assigned agent, admin, or ticket creator can resolve
    const canResolve = user.role === 'admin' || 
                      (ticket.assignee && ticket.assignee.userId.toString() === user._id.toString()) ||
                      (ticket.requester.userId.toString() === user._id.toString());

    if (!canResolve) {
      return res.status(403).json({ message: 'Permission denied: Cannot resolve this ticket' });
    }

    ticket.status = 'Resolved';
    ticket.resolution = resolution;
    ticket.resolvedAt = new Date();

    await ticket.save();

    // Update status in user records
    await User.updateMany(
      {
        $or: [
          { 'createdTickets.ticketId': ticket._id },
          { 'assignedTickets.ticketId': ticket._id }
        ]
      },
      {
        $set: {
          'createdTickets.$[created].status': 'Resolved',
          'assignedTickets.$[assigned].status': 'Resolved'
        }
      },
      {
        arrayFilters: [
          { 'created.ticketId': ticket._id },
          { 'assigned.ticketId': ticket._id }
        ]
      }
    );

    res.json(ticket);
  } catch (error) {
    console.error('Error resolving ticket:', error);
    res.status(500).json({ message: 'Error resolving ticket', error: error.message });
  }
};

// Delete a ticket (admin only)
const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'];
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user can delete tickets
    if (!user.hasPermission('canDeleteTickets')) {
      return res.status(403).json({ message: 'Permission denied: Cannot delete tickets' });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Remove ticket references from user records
    await User.updateMany(
      {},
      {
        $pull: {
          createdTickets: { ticketId: ticket._id },
          assignedTickets: { ticketId: ticket._id }
        }
      }
    );

    await Ticket.findByIdAndDelete(id);

    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ message: 'Error deleting ticket', error: error.message });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  assignTicket,
  addComment,
  resolveTicket,
  deleteTicket
}; 