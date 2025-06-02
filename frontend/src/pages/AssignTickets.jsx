import React, { useState, useEffect } from 'react';
import { ticketService, userService } from '../services/api';
import './AssignTickets.css';

function AssignTickets() {
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [assignments, setAssignments] = useState({});
  const [filter, setFilter] = useState('unassigned');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ticketsData, usersData] = await Promise.all([
        ticketService.getTickets(),
        userService.getAgentsAndAdmins()
      ]);
      
      setTickets(ticketsData);
      // Users are already filtered to agents and admins from the API
      setUsers(usersData);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'unassigned') {
      return !ticket.assignee || !ticket.assignee.userId;
    } else if (filter === 'assigned') {
      return ticket.assignee && ticket.assignee.userId;
    }
    return true;
  });

  const handleAssignmentChange = (ticketId, userId) => {
    setAssignments(prev => ({
      ...prev,
      [ticketId]: userId
    }));
  };

  const assignTicket = async (ticketId, userId) => {
    try {
      console.log('=== FRONTEND ASSIGNMENT REQUEST ===');
      console.log('Ticket ID:', ticketId);
      console.log('User ID:', userId);
      console.log('Selected user:', users.find(u => u._id === userId));
      
      await ticketService.assignTicket(ticketId, userId);
      
      console.log('Assignment successful!');
      setSuccess('Ticket assigned successfully!');
      setTimeout(() => setSuccess(''), 3000);
      
      // Clear the assignment selection for this ticket
      setAssignments(prev => ({
        ...prev,
        [ticketId]: ''
      }));
      
      console.log('Refreshing data...');
      await fetchData(); // Refresh data
      console.log('Data refreshed successfully');
    } catch (err) {
      console.error('=== ASSIGNMENT ERROR ===');
      console.error('Full error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      const errorMessage = err.response?.data?.message || 'Failed to assign ticket';
      setError(errorMessage);
      setTimeout(() => setError(''), 5000); // Show error longer for debugging
    }
  };

  const bulkAssignRandomly = async () => {
    try {
      const unassignedTickets = tickets.filter(t => !t.assignee || !t.assignee.userId);
      const availableUsers = users.filter(u => u.role === 'agent' || u.role === 'admin');
      
      if (unassignedTickets.length === 0) {
        setError('No unassigned tickets to assign');
        setTimeout(() => setError(''), 3000);
        return;
      }

      if (availableUsers.length === 0) {
        setError('No available agents or admins to assign tickets to');
        setTimeout(() => setError(''), 3000);
        return;
      }

      // Randomly assign tickets to available users
      for (let i = 0; i < unassignedTickets.length; i++) {
        const randomUser = availableUsers[i % availableUsers.length];
        await ticketService.assignTicket(unassignedTickets[i]._id, randomUser._id);
      }

      setSuccess(`Successfully assigned ${unassignedTickets.length} tickets!`);
      setTimeout(() => setSuccess(''), 3000);
      fetchData();
    } catch (err) {
      setError('Failed to bulk assign tickets');
      setTimeout(() => setError(''), 3000);
      console.error(err);
    }
  };

  // Helper function to get user display name
  const getUserDisplayName = (user) => {
    if (!user) return 'Unknown User';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Unknown User';
  };

  // Helper function to get assignee display name from ticket
  const getAssigneeDisplayName = (assignee) => {
    if (!assignee || !assignee.userId) return 'Unassigned';
    return assignee.username || 'Unknown User';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return '#dc3545';
      case 'High': return '#fd7e14';
      case 'Medium': return '#ffc107';
      case 'Low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return '#dc3545';
      case 'In Progress': return '#007bff';
      case 'Pending Approval': return '#ffc107';
      case 'Resolved': return '#28a745';
      case 'Closed': return '#6c757d';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="assign-tickets-page">
      <div className="page-header">
        <h1>Assign Tickets</h1>
        <p>Assign tickets to agents and admins for resolution</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <div className="controls-section">
        <div className="filter-controls">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Tickets</option>
            <option value="unassigned">Unassigned Only</option>
            <option value="assigned">Assigned Only</option>
          </select>

          <div className="stats">
            Showing {filteredTickets.length} tickets
            {users.length > 0 && (
              <span className="agent-count">
                • {users.length} agents/admins available
              </span>
            )}
          </div>
        </div>

        <div className="bulk-actions">
          <button
            onClick={bulkAssignRandomly}
            className="btn btn-primary"
            disabled={tickets.filter(t => !t.assignee || !t.assignee.userId).length === 0}
          >
            🎲 Auto-Assign Unassigned Tickets
          </button>
        </div>
      </div>

      <div className="tickets-grid">
        {filteredTickets.map(ticket => (
          <div key={ticket._id} className="ticket-assignment-card">
            <div className="ticket-header">
              <span className="ticket-number">{ticket.ticketNumber}</span>
              <div className="ticket-badges">
                <span 
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                >
                  {ticket.priority}
                </span>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(ticket.status) }}
                >
                  {ticket.status}
                </span>
              </div>
            </div>

            <div className="ticket-content">
              <h3 className="ticket-title">{ticket.title}</h3>
              <p className="ticket-description">
                {ticket.description.length > 100 
                  ? `${ticket.description.substring(0, 100)}...` 
                  : ticket.description
                }
              </p>
              <div className="ticket-meta">
                <span>Requester: {ticket.requester?.username || 'Unknown'}</span>
                <span>Department: {ticket.requester?.department || 'Unknown'}</span>
                <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                <span>Category: {ticket.category}</span>
              </div>
            </div>

            <div className="assignment-section">
              <div className="current-assignee">
                <strong>Current Assignee:</strong> 
                <span className={ticket.assignee && ticket.assignee.userId ? 'assigned' : 'unassigned'}>
                  {getAssigneeDisplayName(ticket.assignee)}
                </span>
              </div>

              <div className="assignment-controls">
                <select
                  value={assignments[ticket._id] || ''}
                  onChange={(e) => handleAssignmentChange(ticket._id, e.target.value)}
                  className="user-select"
                >
                  <option value="">Select Agent/Admin</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>
                      {getUserDisplayName(user)} ({user.role}) - {user.department}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => assignTicket(ticket._id, assignments[ticket._id])}
                  disabled={!assignments[ticket._id]}
                  className="btn btn-assign"
                >
                  {ticket.assignee && ticket.assignee.userId ? 'Reassign' : 'Assign'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTickets.length === 0 && (
        <div className="empty-state">
          <p>No tickets found for the selected filter.</p>
          {filter === 'unassigned' && (
            <p>All tickets have been assigned! 🎉</p>
          )}
        </div>
      )}

      {users.length === 0 && (
        <div className="warning-message">
          <p>⚠️ No agents or admins found. Only agents and admins can be assigned to tickets.</p>
        </div>
      )}
    </div>
  );
}

export default AssignTickets; 