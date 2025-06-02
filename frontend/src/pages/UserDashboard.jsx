import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketService, authService } from '../services/api';
import ErrorBoundary from '../components/ErrorBoundary';
import './Dashboard.css';

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [userTickets, setUserTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch current user
        const userData = await authService.getCurrentUser();
        setUser(userData);
        // Fetch user's tickets
        const ticketsData = await ticketService.getTickets();
        setUserTickets(ticketsData.filter(t => t.requesterEmail === userData.email));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const formatTimeRemaining = (dueDate) => {
    if (!dueDate) return 'No due date';
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due - now;
    if (diff < 0) return 'Overdue';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }

  // Calculate ticket statistics
  const stats = {
    total: userTickets.length,
    open: userTickets.filter(t => t.status === 'Open').length,
    inProgress: userTickets.filter(t => t.status === 'In Progress').length,
    resolved: userTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length
  };

  return (
    <div className="dashboard-page">
      <ErrorBoundary>
        <div className="dashboard-header">
          <h1>My Dashboard</h1>
          <p>Welcome back, {user?.firstName}! Here's an overview of your tickets.</p>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">🎫</div>
            <div className="stat-content">
              <h3>{stats.total}</h3>
              <p>Total Tickets</p>
            </div>
          </div>
          <div className="stat-card open">
            <div className="stat-icon">🔓</div>
            <div className="stat-content">
              <h3>{stats.open}</h3>
              <p>Open Tickets</p>
            </div>
          </div>
          <div className="stat-card in-progress">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <h3>{stats.inProgress}</h3>
              <p>In Progress</p>
            </div>
          </div>
          <div className="stat-card resolved">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.resolved}</h3>
              <p>Resolved</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Quick Actions */}
          <div className="dashboard-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <Link to="/create-ticket" className="action-btn primary">
                📝 Create New Ticket
              </Link>
              <Link to="/chatbot" className="action-btn secondary">
                💬 Chat with Support
              </Link>
            </div>
          </div>

          {/* My Tickets Section */}
          <div className="dashboard-section">
            <h2>My Tickets ({userTickets.length})</h2>
            {userTickets.length > 0 ? (
              <div className="tickets-preview">
                {userTickets.map(ticket => (
                  <div key={ticket._id} className="ticket-card">
                    <div className="ticket-header">
                      <span className="ticket-id">{ticket.ticketNumber}</span>
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
                    <h4>{ticket.title}</h4>
                    <div className="ticket-meta">
                      <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                      <span>SLA: {formatTimeRemaining(ticket.slaResolutionDue)}</span>
                    </div>
                    <div className="ticket-description">
                      <p>{ticket.description}</p>
                    </div>
                    {ticket.assignedTo && (
                      <div className="ticket-assignee">
                        <span>Assigned to: {ticket.assignedTo}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>You haven't created any tickets yet.</p>
                <Link to="/create-ticket" className="action-btn primary">
                  Create Your First Ticket
                </Link>
              </div>
            )}
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default UserDashboard; 