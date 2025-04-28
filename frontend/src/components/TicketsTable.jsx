<<<<<<< HEAD
import React, { useState } from 'react';
import './TicketsTable.css';
import { Link } from 'react-router-dom'; // For linking to other pages

function TicketsTable() {
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [tickets, setTickets] = useState([]); // Empty tickets array initially
  
  // Priority level tooltip messages
  const priorityTooltips = {
    "Critical": "This issue will be resolved at a maximum of 3 hours",
    "High": "This issue will be resolved at a maximum of 5 hours",
    "Medium": "This issue will be resolved at a maximum of 8 hours",
    "Low": "This issue will be resolved at a maximum of 16 hours"
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTickets(tickets.map(ticket => ticket.id));
    } else {
      setSelectedTickets([]);
    }
  };

  const handleSelect = (id) => {
    if (selectedTickets.includes(id)) {
      setSelectedTickets(selectedTickets.filter(ticketId => ticketId !== id));
    } else {
      setSelectedTickets([...selectedTickets, id]);
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Open': return 'status-open';
      case 'In Progress': return 'status-in-progress';
      case 'On Hold': return 'status-on-hold';
      case 'Resolved': return 'status-resolved';
      case 'Closed': return 'status-closed';
      default: return '';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Open': return '●';
      case 'In Progress': return '◉';
      case 'On Hold': return '◎';
      case 'Resolved': return '◌';
      case 'Closed': return '○';
      default: return '●';
    }
  };

  return (
    <div className="tickets-container">
      <div className="tickets-header">
        <h1>Tickets</h1>
      </div>
      
      <div className="action-buttons-container">
        <Link to="/chatbot" className="main-action-button chatbot-button">
          Chat With AI Assistant
        </Link>
        <Link to="/create-ticket" className="main-action-button create-ticket-button">
          Create New Ticket
        </Link>
      </div>
      
      <div className="table-wrapper">
        <div className="table-controls">
          <div className="search-control">
            <button className="control-button search-button">
              <span className="control-icon">🔍</span>
              <span className="control-text">Search</span>
            </button>
          </div>
          <div className="filter-sort-controls">
            <button className="control-button sort-button">
              <span className="control-icon">↕️</span>
              <span className="control-text">Sort</span>
            </button>
            <button className="control-button filter-button">
              <span className="control-icon">⛛</span>
              <span className="control-text">Filter</span>
            </button>
          </div>
        </div>
        
        <div className="tickets-table-container">
          <table className="tickets-table">
            <thead>
              <tr>
                <th className="checkbox-column">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={selectedTickets.length === tickets.length && tickets.length > 0}
                  />
                </th>
                <th className="id-column">ID</th>
                <th className="subject-column">Subject</th>
                <th className="status-column">Status</th>
                <th className="priority-column">Priority</th>
                <th className="type-column">Type</th>
                <th className="team-column">Team</th>
                <th className="contact-column">Contact</th>
                <th className="resolved-column">Resolved</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedTickets.includes(ticket.id)}
                        onChange={() => handleSelect(ticket.id)}
                      />
                    </td>
                    <td>{ticket.id}</td>
                    <td className="subject-cell">{ticket.subject}</td>
                    <td>
                      <span className={`status-indicator ${getStatusClass(ticket.status)}`}>
                        {getStatusIcon(ticket.status)} {ticket.status}
                      </span>
                    </td>
                    <td>
                      <span className="priority-level" title={priorityTooltips[ticket.priority]}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td>{ticket.type}</td>
                    <td>{ticket.team}</td>
                    <td>{ticket.contact}</td>
                    <td>{ticket.resolvedDate || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr className="empty-table-row">
                  <td colSpan="9" className="empty-table-cell">
                    No tickets to display. Create a new ticket to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="tickets-pagination">
          <div className="page-size">
            <button className="page-size-button">20</button>
            <button className="page-size-button">50</button>
            <button className="page-size-button">100</button>
          </div>
          <div className="pagination-info">
            <button className="load-more-button">Load More</button>
            <span className="page-count">0 of 0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketsTable;
=======
import React from 'react';

function TicketsTable() {
  return (
    <section className="tickets-section">
      <button className="new-ticket-btn">+ Issue New Ticket</button>
      <table className="tickets-table">
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {/* No data yet */}
          <tr>
            <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
              No tickets to display.
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

export default TicketsTable;
>>>>>>> 7059d9936a4d3662c2ec06ce3e0d388088e365f0
