import React, { createContext, useContext, useState } from 'react';

// Create the context
const TicketContext = createContext();

// SLA Configurations
const SLA_TIMES = {
  'Critical': { responseTime: 2, resolutionTime: 4 }, // hours
  'High': { responseTime: 4, resolutionTime: 8 },
  'Medium': { responseTime: 8, resolutionTime: 24 },
  'Low': { responseTime: 16, resolutionTime: 72 }
};

// Auto-assign priority based on category
const CATEGORY_PRIORITY_MAPPING = {
  'System Outage': 'Critical',
  'Security Incident': 'Critical',
  'Application Error': 'High',
  'Network Issue': 'High',
  'Hardware Problem': 'Medium',
  'Software Installation': 'Medium',
  'Access Request': 'Low',
  'General Inquiry': 'Low'
};

const mockTickets = [
  {
    id: 'TKT-001',
    subject: 'Login Issues',
    description: 'Unable to login to the system',
    priority: 'High',
    status: 'Open',
    category: 'Application Error',
    type: 'Technical Issue',
    requesterName: 'John Doe',
    requesterEmail: 'john@priv.com',
    assignedTo: null,
    assignedTeam: 'IT Support',
    createdDate: '2024-01-15T10:30:00Z',
    lastUpdated: '2024-01-15T10:30:00Z',
    slaResponseDue: '2024-01-15T14:30:00Z',
    slaResolutionDue: '2024-01-15T18:30:00Z',
    timeSpent: 0,
    approvalRequired: false,
    approvalStatus: null,
    approver: null,
    attachments: [],
    comments: [],
    tags: ['login', 'authentication'],
    isOverdue: false,
    escalated: false,
    resolution: null,
    resolvedDate: null,
    closedDate: null
  },
  {
    id: 'TKT-002',
    subject: 'Cannot access files',
    description: 'Getting permission denied when accessing shared files',
    priority: 'Medium',
    status: 'In Progress',
    category: 'Access Request',
    type: 'Access Request',
    requesterName: 'Jane Smith',
    requesterEmail: 'jane@priv.com',
    assignedTo: 'Tech Support',
    assignedTeam: 'IT Support',
    createdDate: '2024-01-14T09:15:00Z',
    lastUpdated: '2024-01-15T11:00:00Z',
    slaResponseDue: '2024-01-14T17:15:00Z',
    slaResolutionDue: '2024-01-15T09:15:00Z',
    timeSpent: 2.5,
    approvalRequired: true,
    approvalStatus: 'Pending',
    approver: 'Admin User',
    attachments: [],
    comments: [
      {
        id: 1,
        author: 'Tech Support',
        content: 'Checking permissions with system admin',
        timestamp: '2024-01-15T11:00:00Z',
        type: 'internal'
      }
    ],
    tags: ['access', 'permissions', 'files'],
    isOverdue: true,
    escalated: false,
    resolution: null,
    resolvedDate: null,
    closedDate: null
  }
];

// Provider component
export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState(mockTickets);
  const [workingHours, setWorkingHours] = useState({
    start: '09:00',
    end: '17:00',
    timezone: 'UTC+7',
    workdays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  });

  // Calculate SLA times based on priority and working hours
  const calculateSLADates = (createdDate, priority) => {
    const created = new Date(createdDate);
    const slaConfig = SLA_TIMES[priority];
    
    const responseTime = slaConfig.responseTime * 60 * 60 * 1000; // Convert to milliseconds
    const resolutionTime = slaConfig.resolutionTime * 60 * 60 * 1000;
    
    return {
      slaResponseDue: new Date(created.getTime() + responseTime),
      slaResolutionDue: new Date(created.getTime() + resolutionTime)
    };
  };

  // Auto-assign priority based on category
  const getAutoPriority = (category) => {
    return CATEGORY_PRIORITY_MAPPING[category] || 'Medium';
  };

  // Check if approval is required based on ticket type and category
  const requiresApproval = (type, category) => {
    const approvalRequiredTypes = ['Access Request', 'Hardware Request', 'Software Request'];
    const approvalRequiredCategories = ['Access Request', 'System Change', 'Budget Request'];
    return approvalRequiredTypes.includes(type) || approvalRequiredCategories.includes(category);
  };

  // Create new ticket
  const addTicket = (ticketData) => {
    const now = new Date().toISOString();
    const autoPriority = ticketData.priority || getAutoPriority(ticketData.category);
    const slaData = calculateSLADates(now, autoPriority);
    const needsApproval = requiresApproval(ticketData.type, ticketData.category);

    const newTicket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      subject: ticketData.subject,
      description: ticketData.description,
      priority: autoPriority,
      status: needsApproval ? 'Pending Approval' : 'Open',
      category: ticketData.category,
      type: ticketData.type,
      requesterName: ticketData.requesterName || 'Current User',
      requesterEmail: ticketData.requesterEmail || 'user@priv.com',
      assignedTo: null,
      assignedTeam: ticketData.team || 'IT Support',
      createdDate: now,
      lastUpdated: now,
      ...slaData,
      timeSpent: 0,
      approvalRequired: needsApproval,
      approvalStatus: needsApproval ? 'Pending' : null,
      approver: needsApproval ? 'Admin User' : null,
      attachments: ticketData.attachments || [],
      comments: [],
      tags: ticketData.tags || [],
      isOverdue: false,
      escalated: false,
      resolution: null,
      resolvedDate: null,
      closedDate: null
    };

    setTickets(prev => [...prev, newTicket]);
    return newTicket;
  };

  // Update ticket
  const updateTicket = (ticketId, updates) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, ...updates, lastUpdated: new Date().toISOString() }
        : ticket
    ));
  };

  // Assign ticket to technician
  const assignTicket = (ticketId, assignee, team = null) => {
    updateTicket(ticketId, {
      assignedTo: assignee,
      assignedTeam: team || tickets.find(t => t.id === ticketId)?.assignedTeam,
      status: 'In Progress'
    });
  };

  // Add comment to ticket
  const addComment = (ticketId, comment) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      const newComment = {
        id: ticket.comments.length + 1,
        author: comment.author,
        content: comment.content,
        timestamp: new Date().toISOString(),
        type: comment.type || 'public'
      };

      updateTicket(ticketId, {
        comments: [...ticket.comments, newComment]
      });
    }
  };

  // Approve or reject ticket
  const approveTicket = (ticketId, approved, approverName, reason = '') => {
    const updates = {
      approvalStatus: approved ? 'Approved' : 'Rejected',
      approver: approverName,
      status: approved ? 'Open' : 'Closed'
    };

    if (!approved) {
      updates.resolution = `Ticket rejected: ${reason}`;
      updates.closedDate = new Date().toISOString();
    }

    updateTicket(ticketId, updates);

    // Add system comment
    addComment(ticketId, {
      author: 'System',
      content: `Ticket ${approved ? 'approved' : 'rejected'} by ${approverName}. ${reason ? `Reason: ${reason}` : ''}`,
      type: 'system'
    });
  };

  // Resolve ticket
  const resolveTicket = (ticketId, resolution, resolvedBy) => {
    const now = new Date().toISOString();
    updateTicket(ticketId, {
      status: 'Resolved',
      resolution: resolution,
      resolvedDate: now,
      assignedTo: resolvedBy
    });

    addComment(ticketId, {
      author: resolvedBy,
      content: `Ticket resolved: ${resolution}`,
      type: 'resolution'
    });
  };

  // Close ticket
  const closeTicket = (ticketId, closedBy, reason = '') => {
    updateTicket(ticketId, {
      status: 'Closed',
      closedDate: new Date().toISOString()
    });

    if (reason) {
      addComment(ticketId, {
        author: closedBy,
        content: `Ticket closed: ${reason}`,
        type: 'system'
      });
    }
  };

  // Escalate ticket
  const escalateTicket = (ticketId, escalatedBy, reason) => {
    updateTicket(ticketId, {
      escalated: true,
      priority: 'Critical'
    });

    addComment(ticketId, {
      author: escalatedBy,
      content: `Ticket escalated: ${reason}`,
      type: 'escalation'
    });
  };

  // Get ticket statistics
  const getTicketStats = () => {
    const stats = {
      total: tickets.length,
      open: tickets.filter(t => t.status === 'Open').length,
      inProgress: tickets.filter(t => t.status === 'In Progress').length,
      pendingApproval: tickets.filter(t => t.status === 'Pending Approval').length,
      resolved: tickets.filter(t => t.status === 'Resolved').length,
      closed: tickets.filter(t => t.status === 'Closed').length,
      overdue: tickets.filter(t => t.isOverdue).length,
      escalated: tickets.filter(t => t.escalated).length,
      critical: tickets.filter(t => t.priority === 'Critical').length,
      high: tickets.filter(t => t.priority === 'High').length,
      medium: tickets.filter(t => t.priority === 'Medium').length,
      low: tickets.filter(t => t.priority === 'Low').length
    };

    return stats;
  };

  // Get tickets assigned to a specific user
  const getAssignedTickets = (assignee) => {
    return tickets.filter(ticket => ticket.assignedTo === assignee);
  };

  // Get tickets by status
  const getTicketsByStatus = (status) => {
    return tickets.filter(ticket => ticket.status === status);
  };

  // Get overdue tickets
  const getOverdueTickets = () => {
    return tickets.filter(ticket => {
      const now = new Date();
      const dueDateField = ticket.status === 'Open' ? 'slaResponseDue' : 'slaResolutionDue';
      return new Date(ticket[dueDateField]) < now && !['Resolved', 'Closed'].includes(ticket.status);
    });
  };

  const value = {
    tickets,
    workingHours,
    setWorkingHours,
    addTicket,
    updateTicket,
    assignTicket,
    addComment,
    approveTicket,
    resolveTicket,
    closeTicket,
    escalateTicket,
    getTicketStats,
    getAssignedTickets,
    getTicketsByStatus,
    getOverdueTickets,
    SLA_TIMES,
    CATEGORY_PRIORITY_MAPPING
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
};

// Hook to use ticket context
export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};
