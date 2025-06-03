import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketService, authService } from '../services/api';
import './TicketsTable.css';

const TicketsTable = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Get current user
        const userData = await authService.getCurrentUser();
        console.log('🎫 TicketsTable: Current user:', userData);
        setUser(userData);
        
        // Fetch tickets
        const response = await ticketService.getTickets();
        console.log('🎫 TicketsTable: Fetched tickets:', response);
        console.log('🎫 TicketsTable: Number of tickets:', response.length);
        
        // Debug: Check which tickets the user should be able to view
        if (userData.role === 'user') {
          const userTickets = response.filter(ticket => ticket.requester?.userId === userData._id);
          console.log('🎫 TicketsTable: User can view these tickets:', userTickets);
          console.log('🎫 TicketsTable: User ticket count:', userTickets.length);
        }
        
        setTickets(response);
      } catch (err) {
        console.error('🚨 TicketsTable: Fetch error:', err);
        setError(err.response?.data?.message || 'Failed to fetch tickets');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusClass = (status) => {
    if (!status) return '';
    switch (status.toLowerCase()) {
      case 'open': return 'status-open';
      case 'in progress': return 'status-in-progress';
      case 'resolved': return 'status-resolved';
      case 'closed': return 'status-closed';
      default: return '';
    }
  };

  const getPriorityClass = (priority) => {
    if (!priority) return '';
    switch (priority.toLowerCase()) {
      case 'critical': return 'priority-critical';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  // Debug helper function
  const canUserViewTicket = (ticket) => {
    if (!user) {
      console.log('🔍 No user found');
      return false;
    }
    
    // Convert IDs to strings for comparison
    const ticketRequesterUserId = ticket.requester?.userId?.toString();
    const currentUserId = user._id?.toString();
    
    const canView = user.role === 'admin' || 
                   user.role === 'agent' || 
                   ticketRequesterUserId === currentUserId;
    
    console.log(`🔍 Can view ticket ${ticket.ticketNumber || ticket._id}:`, {
      ticketId: ticket._id,
      ticketRequesterUserId: ticketRequesterUserId,
      currentUserId: currentUserId,
      userRole: user.role,
      idsMatch: ticketRequesterUserId === currentUserId,
      canView: canView
    });
    
    return canView;
  };

  if (loading) {
    return <div className="loading">Loading tickets...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <section className="tickets-container">
      <div className="tickets-header">
        <h1>Tickets</h1>
      </div>

      <div className="action-buttons-container">
        <Link to="/chatbot" className="main-action-button chatbot-button">
          Chat with Bot
        </Link>
        <Link to="/create-ticket" className="main-action-button create-ticket-button">
          Issue New Ticket
        </Link>
      </div>

      <div className="tickets-table-container">
        <table className="tickets-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Created</th>
              <th>Requester</th>
              {(user?.role === 'admin' || user?.role === 'agent') && <th>Assigned To</th>}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets
              .filter(ticket => {
                // Only show tickets the user can actually access
                if (!user) return false;
                return user.role === 'admin' || 
                       user.role === 'agent' || 
                       ticket.requester?.userId?.toString() === user._id?.toString();
              })
              .map(ticket => (
              <tr key={ticket._id}>
                <td>{ticket.ticketNumber || ticket._id}</td>
                <td>{ticket.title}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(ticket.status)}`}>
                    {ticket.status || 'Open'}
                  </span>
                </td>
                <td>
                  <span className={`priority-badge ${getPriorityClass(ticket.priority)}`}>
                    {ticket.priority || 'Medium'}
                  </span>
                </td>
                <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                <td>{ticket.requester?.username || 'N/A'}</td>
                {(user?.role === 'admin' || user?.role === 'agent') && (
                  <td>{ticket.assignee?.username || 'Unassigned'}</td>
                )}
                <td>
                  {/* All visible tickets now have View access */}
                  {user?.role === 'admin' ? (
                    <Link to={`/tickets/${ticket._id}/edit`} className="edit-btn">View</Link>
                  ) : user?.role === 'agent' ? (
                    <>
                      <Link to={`/tickets/${ticket._id}`} className="view-btn">View</Link>
                      <Link to={`/tickets/${ticket._id}/edit`} className="edit-btn">Edit</Link>
                    </>
                  ) : (
                    <Link to={`/tickets/${ticket._id}`} className="view-btn">View</Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TicketsTable;
