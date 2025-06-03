const Ticket = require('../models/ticket');
const User = require('../models/user');

// Create a new ticket
const createTicket = async (req, res) => {
  try {
    console.log('Received ticket creation request:', req.body);
    const { title, description, category, priority } = req.body;
    
    // Get the authenticated user
    const userId = req.headers['x-user-id'] || req.headers['X-User-Id'];
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
    console.log('GET /api/tickets called');
    const userId = req.headers['x-user-id'] || req.headers['X-User-Id'];
    console.log('User ID from headers:', userId);
    
    // Check if user ID is provided
    if (!userId) {
      console.log('No user ID provided');
      return res.status(401).json({ 
        message: 'Authentication required. Please log in to access tickets.',
        code: 'NO_USER_ID'
      });
    }

    console.log('Looking up user with ID:', userId);
    const user = await User.findById(userId);
    
    if (!user) {
      console.log('User not found for ID:', userId);
      return res.status(404).json({ 
        message: 'User not found. Please log in again.',
        code: 'USER_NOT_FOUND'
      });
    }

    console.log('User found:', { id: user._id, username: user.username, role: user.role });

    let query = {};
    
    // If user is not admin or agent, only show their own tickets
    if (user.role !== 'admin' && user.role !== 'agent') {
      query['requester.userId'] = userId;
      console.log('User is regular user, filtering by requester.userId:', userId);
    } else {
      console.log('User is admin/agent, showing all tickets');
    }

    console.log('Executing ticket query:', query);
    
    // Simplified query without populate for now
    const tickets = await Ticket.find(query).sort({ createdAt: -1 });
    
    console.log('Tickets found:', tickets.length);
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
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
    console.log('=== GET TICKET BY ID REQUEST ===');
    const { id } = req.params;
    const userId = req.headers['x-user-id'] || req.headers['X-User-Id'];
    
    console.log('Request details:', {
      ticketId: id,
      userId: userId,
      headers: req.headers
    });

    if (!userId) {
      console.log('ERROR: No user ID provided in headers');
      return res.status(401).json({ message: 'User ID is required' });
    }

    const user = await User.findById(userId);
    console.log('User lookup result:', user ? {
      id: user._id,
      username: user.username,
      role: user.role
    } : 'User not found');
    
    if (!user) {
      console.log('ERROR: User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Looking up ticket with ID:', id);
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      console.log('ERROR: Ticket not found');
      return res.status(404).json({ message: 'Ticket not found' });
    }

    console.log('Found ticket:', {
      id: ticket._id,
      ticketNumber: ticket.ticketNumber,
      title: ticket.title,
      requester: ticket.requester,
      assignee: ticket.assignee
    });

    // Check if user can access this ticket
    console.log('Checking access permissions...');
    console.log('User ID:', user._id.toString());
    console.log('Ticket requester ID:', ticket.requester.userId.toString());
    console.log('User role:', user.role);
    console.log('Ticket assignee:', ticket.assignee);

    // Debug the canAccessTicket method step by step
    console.log('=== PERMISSION DEBUGGING ===');
    console.log('1. Is user admin?', user.role === 'admin');
    console.log('2. Is user agent?', user.role === 'agent');
    console.log('3. Is user the requester?', ticket.requester.userId.toString() === user._id.toString());
    console.log('4. Is user assigned to ticket?', ticket.assignee && ticket.assignee.userId && ticket.assignee.userId.toString() === user._id.toString());

    // DIRECT PERMISSION CHECK - bypass User model method for reliability
    let canAccess = false;
    
    // Admin can access all tickets
    if (user.role === 'admin') {
      canAccess = true;
      console.log('Access granted: User is admin');
    }
    // Agent can access all tickets
    else if (user.role === 'agent') {
      canAccess = true;
      console.log('Access granted: User is agent');
    }
    // User can access their own tickets
    else if (ticket.requester.userId.toString() === user._id.toString()) {
      canAccess = true;
      console.log('Access granted: User is the ticket requester');
    }
    // User can access tickets assigned to them
    else if (ticket.assignee && ticket.assignee.userId && ticket.assignee.userId.toString() === user._id.toString()) {
      canAccess = true;
      console.log('Access granted: User is assigned to ticket');
    }
    else {
      console.log('Access denied: No matching permission criteria');
    }

    console.log('Final permission result:', canAccess);

    if (!canAccess) {
      console.log('ERROR: Access denied');
      return res.status(403).json({ message: 'Access denied' });
    }

    console.log('Access granted, returning ticket data');
    res.json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ message: 'Error fetching ticket', error: error.message });
  }
};

// Update a ticket
const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.headers['x-user-id'] || req.headers['X-User-Id'];
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
    console.log('=== TICKET ASSIGNMENT REQUEST ===');
    const { id } = req.params;
    const { assigneeId } = req.body;
    const userId = req.headers['x-user-id'] || req.headers['X-User-Id'];
    
    console.log('Request details:', {
      ticketId: id,
      assigneeId,
      requestingUserId: userId
    });

    const user = await User.findById(userId);
    
    if (!user) {
      console.log('ERROR: Requesting user not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Requesting user:', {
      id: user._id,
      username: user.username,
      role: user.role
    });

    // Check if user can assign tickets
    if (!user.hasPermission('canAssignTickets')) {
      console.log('ERROR: User does not have permission to assign tickets');
      return res.status(403).json({ message: 'Permission denied: Cannot assign tickets' });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      console.log('ERROR: Ticket not found');
      return res.status(404).json({ message: 'Ticket not found' });
    }

    console.log('Found ticket:', {
      id: ticket._id,
      ticketNumber: ticket.ticketNumber,
      title: ticket.title,
      currentAssignee: ticket.assignee
    });

    const assignee = await User.findById(assigneeId);
    if (!assignee) {
      console.log('ERROR: Assignee not found');
      return res.status(404).json({ message: 'Assignee not found' });
    }

    console.log('Found assignee:', {
      id: assignee._id,
      username: assignee.username,
      role: assignee.role
    });

    // Check if assignee is an agent or admin
    if (assignee.role === 'user') {
      console.log('ERROR: Cannot assign ticket to regular user');
      return res.status(400).json({ message: 'Cannot assign ticket to regular user' });
    }

    // Remove from previous assignee if exists
    if (ticket.assignee && ticket.assignee.userId) {
      console.log('Removing ticket from previous assignee');
      const previousAssignee = await User.findById(ticket.assignee.userId);
      if (previousAssignee) {
        previousAssignee.assignedTickets = previousAssignee.assignedTickets.filter(
          t => t.ticketId.toString() !== ticket._id.toString()
        );
        await previousAssignee.save();
        console.log('Removed from previous assignee successfully');
      }
    }

    // Update ticket assignment
    console.log('Updating ticket assignment...');
    ticket.assignee = {
      userId: assignee._id,
      username: assignee.username
    };
    
    if (ticket.status === 'Open') {
      ticket.status = 'In Progress';
      console.log('Updated ticket status to In Progress');
    }

    await ticket.save();
    console.log('Ticket saved successfully');

    // Add ticket to assignee's assignedTickets
    console.log('Adding ticket to assignee assignedTickets...');
    
    // Check if ticket is already in assignee's list
    const existingIndex = assignee.assignedTickets.findIndex(
      t => t.ticketId.toString() === ticket._id.toString()
    );
    
    if (existingIndex === -1) {
      await assignee.addAssignedTicket(ticket);
      console.log('Added ticket to assignee assignedTickets');
    } else {
      console.log('Ticket already in assignee assignedTickets, updating status');
      assignee.assignedTickets[existingIndex].status = ticket.status;
      assignee.assignedTickets[existingIndex].assignedAt = new Date();
      await assignee.save();
    }

    console.log('Assignment completed successfully');
    res.json(ticket);
  } catch (error) {
    console.error('ERROR in assignTicket:', error);
    res.status(500).json({ message: 'Error assigning ticket', error: error.message });
  }
};

// Add a comment to a ticket
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.headers['x-user-id'] || req.headers['X-User-Id'];
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
    const userId = req.headers['x-user-id'] || req.headers['X-User-Id'];
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
    const userId = req.headers['x-user-id'] || req.headers['X-User-Id'];
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