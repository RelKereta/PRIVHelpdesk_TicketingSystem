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
        setUser(userData);
        
        // Fetch tickets
        const response = await ticketService.getTickets();
        console.log('Fetched tickets:', response);
        setTickets(response);
      } catch (err) {
        console.error('Tickets fetch error:', err);
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
            {tickets.map(ticket => (
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
                  {/* For admin, only show 'View' (was Edit) button, remove View button */}
                  {user?.role === 'admin' ? (
                    <Link to={`/tickets/${ticket._id}/edit`} className="edit-btn">View</Link>
                  ) : (
                    <>
                      <Link to={`/tickets/${ticket._id}`} className="view-btn">View</Link>
                      {(user?.role === 'agent') && (
                        <Link to={`/tickets/${ticket._id}/edit`} className="edit-btn">Edit</Link>
                      )}
                    </>
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
