import React, { useState, useEffect } from 'react';
import { ticketService } from '../services/api';
import './BulkResolve.css';

function BulkResolve() {
  const [tickets, setTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resolving, setResolving] = useState(false);
  const [resolutionMessage, setResolutionMessage] = useState('');
  const [filter, setFilter] = useState('open');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await ticketService.getTickets();
      setTickets(data);
    } catch (err) {
      setError('Failed to fetch tickets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'open') {
      return ticket.status === 'Open' || ticket.status === 'In Progress';
    } else if (filter === 'all') {
      return ticket.status !== 'Resolved' && ticket.status !== 'Closed';
    }
    return true;
  });

  const handleTicketSelect = (ticketId) => {
    setSelectedTickets(prev => {
      if (prev.includes(ticketId)) {
        return prev.filter(id => id !== ticketId);
      } else {
        return [...prev, ticketId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets.map(ticket => ticket._id));
    }
  };

  const handleBulkResolve = async () => {
    if (selectedTickets.length === 0) {
      setError('Please select at least one ticket to resolve');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (!resolutionMessage.trim()) {
      setError('Please provide a resolution message');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      setResolving(true);
      
      // Use bulk resolve API if available, otherwise resolve individually
      try {
        await ticketService.bulkResolveTickets(selectedTickets, resolutionMessage);
      } catch {
        // Fallback to individual resolution if bulk API is not available
        for (const ticketId of selectedTickets) {
          await ticketService.resolveTicket(ticketId, resolutionMessage);
        }
      }

      setSuccess(`Successfully resolved ${selectedTickets.length} tickets!`);
      setTimeout(() => setSuccess(''), 5000);
      
      // Reset state
      setSelectedTickets([]);
      setResolutionMessage('');
      
      // Refresh tickets
      fetchTickets();
    } catch (err) {
      setError('Failed to resolve tickets');
      setTimeout(() => setError(''), 3000);
      console.error(err);
    } finally {
      setResolving(false);
    }
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
    <div className="bulk-resolve-page">
      <div className="page-header">
        <h1>Bulk Resolve Tickets</h1>
        <p>Resolve multiple tickets at once with a common resolution</p>
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
            <option value="open">Open & In Progress</option>
            <option value="all">All Unresolved</option>
          </select>

          <div className="selection-info">
            {selectedTickets.length} of {filteredTickets.length} tickets selected
          </div>
        </div>

        <div className="bulk-actions">
          <button
            onClick={handleSelectAll}
            className="btn btn-secondary"
          >
            {selectedTickets.length === filteredTickets.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>

      {/* Resolution Message */}
      <div className="resolution-section">
        <h3>Resolution Message</h3>
        <textarea
          value={resolutionMessage}
          onChange={(e) => setResolutionMessage(e.target.value)}
          placeholder="Enter a resolution message that will be applied to all selected tickets..."
          className="resolution-textarea"
          rows={4}
        />
        
        <button
          onClick={handleBulkResolve}
          disabled={selectedTickets.length === 0 || !resolutionMessage.trim() || resolving}
          className="btn btn-success resolve-btn"
        >
          {resolving ? 'Resolving...' : `Resolve ${selectedTickets.length} Tickets`}
        </button>
      </div>

      {/* Tickets List */}
      <div className="tickets-section">
        <h3>Available Tickets ({filteredTickets.length})</h3>
        
        {filteredTickets.length === 0 ? (
          <div className="empty-state">
            <p>No tickets available for resolution.</p>
          </div>
        ) : (
          <div className="tickets-grid">
            {filteredTickets.map(ticket => (
              <div 
                key={ticket._id} 
                className={`ticket-card ${selectedTickets.includes(ticket._id) ? 'selected' : ''}`}
                onClick={() => handleTicketSelect(ticket._id)}
              >
                <div className="ticket-header">
                  <div className="ticket-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(ticket._id)}
                      onChange={() => handleTicketSelect(ticket._id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
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
                  <h4 className="ticket-title">{ticket.title}</h4>
                  <p className="ticket-description">{ticket.description}</p>
                  <div className="ticket-meta">
                    <span>Requester: {ticket.requesterName || 'Unknown'}</span>
                    <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    {ticket.assignedTo && (
                      <span>Assigned to: {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BulkResolve; 