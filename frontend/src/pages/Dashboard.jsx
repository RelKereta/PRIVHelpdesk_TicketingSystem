import React, { useState, useEffect } from 'react';
import TicketsTable from '../components/TicketsTable.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import './Dashboard.css';
import { ticketService, authService } from '../services/api';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overdueTickets, setOverdueTickets] = useState([]);
  const [userTickets, setUserTickets] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        // Check if user is logged in first
        const userData = await authService.getCurrentUser();
        if (!userData || !userData._id) {
          // Redirect to sign-in if no valid user found
          window.location.href = '/signin';
          return;
        }
        setUser(userData);
        
        // Fetch tickets based on user role
        const ticketsData = await ticketService.getTickets();
        
        // Calculate stats from tickets data
        const calculatedStats = {
          total: ticketsData.length,
          open: ticketsData.filter(t => t.status === 'Open').length,
          inProgress: ticketsData.filter(t => t.status === 'In Progress').length,
          overdue: ticketsData.filter(t => 
            t.slaResolutionDue && 
            new Date(t.slaResolutionDue) < new Date() && 
            t.status !== 'Resolved' && 
            t.status !== 'Closed'
          ).length,
          critical: ticketsData.filter(t => t.priority === 'Critical').length,
          pendingApproval: ticketsData.filter(t => t.approvalStatus === 'Pending').length
        };
        setStats(calculatedStats);
        
        // Filter overdue tickets
        setOverdueTickets(ticketsData.filter(t => 
          t.slaResolutionDue && 
          new Date(t.slaResolutionDue) < new Date() && 
          t.status !== 'Resolved' && 
          t.status !== 'Closed'
        ));

        // Filter user tickets based on role
        if (userData.role === 'agent' || userData.role === 'admin') {
          // For agents and admins, show tickets assigned to them
          setUserTickets(ticketsData.filter(t => 
            t.assignedTo && 
            t.assignedTo._id === userData._id
          ));
          // Show pending approvals for agents and admins
          setPendingApprovals(ticketsData.filter(t => 
            t.approvalStatus === 'Pending'
          ));
        } else {
          // For regular users, show only their created tickets
          setUserTickets(ticketsData.filter(t => 
            t.requester && 
            t.requester.userId === userData._id
          ));
        }
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        
        // Handle authentication errors
        if (err.response?.status === 401 || err.message === 'No user found') {
          localStorage.removeItem('user');
          window.location.href = '/signin';
          return;
        }
        
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

  // Helper role checks
  const isAdmin = () => user && user.role === 'admin';
  const isTechnician = () => user && user.role === 'agent';

  return (
    <div className="dashboard-page">
      <ErrorBoundary>
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.firstName}! Here's your helpdesk overview.</p>
        </div>
        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">🎫</div>
            <div className="stat-content">
              <h3>{stats.total || 0}</h3>
              <p>Total Tickets</p>
            </div>
          </div>
          <div className="stat-card open">
            <div className="stat-icon">🔓</div>
            <div className="stat-content">
              <h3>{stats.open || 0}</h3>
              <p>Open Tickets</p>
            </div>
          </div>
          <div className="stat-card in-progress">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <h3>{stats.inProgress || 0}</h3>
              <p>In Progress</p>
            </div>
          </div>
          <div className="stat-card overdue">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <h3>{stats.overdue || 0}</h3>
              <p>Overdue</p>
            </div>
          </div>
          {(isTechnician() || isAdmin()) && (
            <>
              <div className="stat-card critical">
                <div className="stat-icon">🚨</div>
                <div className="stat-content">
                  <h3>{stats.critical || 0}</h3>
                  <p>Critical Priority</p>
                </div>
              </div>
              <div className="stat-card approval">
                <div className="stat-icon">✋</div>
                <div className="stat-content">
                  <h3>{stats.pendingApproval || 0}</h3>
                  <p>Pending Approval</p>
                </div>
              </div>
            </>
          )}
        </div>
        {/* Priority Alerts */}
        {overdueTickets.length > 0 && (
          <div className="alert-section">
            <div className="alert-card overdue-alert">
              <h3>⚠️ Overdue Tickets ({overdueTickets.length})</h3>
              <div className="overdue-list">
                {overdueTickets.slice(0, 3).map(ticket => (
                  <div key={ticket._id} className="overdue-item">
                    <span className="ticket-id">{ticket.ticketNumber}</span>
                    <span className="ticket-subject">{ticket.title}</span>
                    <span className="overdue-time">
                      {formatTimeRemaining(ticket.slaResolutionDue)} overdue
                    </span>
                  </div>
                ))}
                {overdueTickets.length > 3 && (
                  <p className="more-items">+{overdueTickets.length - 3} more overdue tickets</p>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="dashboard-content">
          {/* Pending Approvals for Admins */}
          {isAdmin() && pendingApprovals.length > 0 && (
            <div className="dashboard-section">
              <h2>Pending Approvals ({pendingApprovals.length})</h2>
              <div className="approval-cards">
                {pendingApprovals.slice(0, 3).map(ticket => (
                  <div key={ticket._id} className="approval-card">
                    <div className="approval-header">
                      <span className="ticket-id">{ticket.ticketNumber}</span>
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                    <h4>{ticket.title}</h4>
                    <p className="requester">Requested by: {ticket.requesterName}</p>
                    <p className="description">{ticket.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Quick Actions for Technicians */}
          {(isTechnician() || isAdmin()) && (
            <div className="dashboard-section">
              <h2>Quick Actions</h2>
              <div className="quick-actions">
                <button 
                  className="action-btn primary"
                  onClick={() => window.location.href = '/all-tickets'}
                >
                  📋 View All Tickets
                </button>
                <button 
                  className="action-btn secondary"
                  onClick={() => window.location.href = '/assign-tickets'}
                >
                  👥 Assign Tickets
                </button>
                <button 
                  className="action-btn success"
                  onClick={() => window.location.href = '/bulk-resolve'}
                >
                  ✅ Bulk Resolve
                </button>
                <button 
                  className="action-btn info"
                  onClick={() => window.location.href = '/reports'}
                >
                  📊 Generate Report
                </button>
              </div>
            </div>
          )}
          {/* My Tickets Section */}
          <div className="dashboard-section">
            <h2>
              {(isTechnician() || isAdmin()) ? 'My Assigned Tickets' : 'My Tickets'} 
              ({userTickets.length})
            </h2>
            {userTickets.length > 0 ? (
              <div className="tickets-preview">
                {userTickets.slice(0, 5).map(ticket => (
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
                  </div>
                ))}
                {userTickets.length > 5 && (
                  <div className="view-all-link">
                    <a href="/all-tickets">View all {userTickets.length} tickets →</a>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <p>No tickets assigned to you at the moment.</p>
              </div>
            )}
          </div>
          {/* All Tickets Section */}
          <div className="dashboard-section">
            <h2>Recent Tickets</h2>
            <TicketsTable />
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default Dashboard;
