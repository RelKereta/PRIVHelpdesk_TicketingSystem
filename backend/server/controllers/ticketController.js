const Ticket = require('../models/ticket');
const User = require('../models/user');

// Create a new ticket
const createTicket = async (req, res) => {
  try {
    console.log('Received ticket creation request:', req.body);
    const { title, description, category, priority } = req.body;
    
    // Get the authenticated user
    const userId = req.headers['x-user-id'];
    console.log('User ID from headers:', userId);
    
    if (!userId) {
      return res.status(401).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId);
    console.log('Found user:', user ? { id: user._id, username: user.username, role: user.role } : 'Not found');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({ 
        message: 'Title, description, and category are required',
        received: { title, description, category }
      });
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

    console.log('Creating ticket with data:', ticketData);

    const ticket = new Ticket(ticketData);
    await ticket.save();
    console.log('Ticket saved successfully:', ticket._id);

    // Add ticket to user's createdTickets
    await user.addCreatedTicket(ticket);
    console.log('Ticket added to user\'s createdTickets');

    res.status(201).json(ticket);
  } catch (error) {
    console.error('Error creating ticket:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    res.status(500).json({ 
      message: 'Error creating ticket', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? {
        name: error.name,
        code: error.code,
        stack: error.stack
      } : undefined
    });
  }
};

// Get all tickets with role-based filtering
const getTickets = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    
    // Check if user ID is provided
    if (!userId) {
      return res.status(401).json({ 
        message: 'Authentication required. Please log in to access tickets.',
        code: 'NO_USER_ID'
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found. Please log in again.',
        code: 'USER_NOT_FOUND'
      });
    }

    let query = {};
    
    // If user is not admin or agent, only show their own tickets
    if (user.role !== 'admin' && user.role !== 'agent') {
      query['requester.userId'] = userId;
    }

    const tickets = await Ticket.find(query)
      .sort({ createdAt: -1 })
      .populate('requester.userId', 'username email department')
      .populate('assignedTo', 'username email department');

    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ 
      message: 'Error fetching tickets', 
      error: error.message,
      code: 'INTERNAL_ERROR'
    });
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