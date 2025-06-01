import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import TicketsTable from '../components/TicketsTable.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import './Dashboard.css';

function Dashboard() {
  const { user, isAdmin, isTechnician } = useAuth();
  const { 
    tickets, 
    getTicketStats, 
    getAssignedTickets, 
    getOverdueTickets,
    approveTicket,
    resolveTicket
  } = useTickets();

  const [stats, setStats] = useState({});
  const [overdueTickets, setOverdueTickets] = useState([]);
  const [userTickets, setUserTickets] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);

  useEffect(() => {
    // Update statistics
    setStats(getTicketStats());
    setOverdueTickets(getOverdueTickets());
    
    if (isTechnician() || isAdmin()) {
      setUserTickets(getAssignedTickets(user?.name));
      setPendingApprovals(tickets.filter(t => t.approvalStatus === 'Pending'));
    } else {
      // Regular users see their own tickets
      setUserTickets(tickets.filter(t => t.requesterEmail === user?.email));
    }
  }, [tickets, user, isTechnician, isAdmin]);

  const handleQuickApprove = (ticketId, approved) => {
    approveTicket(ticketId, approved, user?.name, approved ? '' : 'Quick rejection from dashboard');
  };

  const handleQuickResolve = (ticketId, resolution) => {
    resolveTicket(ticketId, resolution, user?.name);
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

  return (
    <div className="dashboard-page">
      <ErrorBoundary>
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.name}! Here's your helpdesk overview.</p>
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
                  <div key={ticket.id} className="overdue-item">
                    <span className="ticket-id">{ticket.id}</span>
                    <span className="ticket-subject">{ticket.subject}</span>
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
                  <div key={ticket.id} className="approval-card">
                    <div className="approval-header">
                      <span className="ticket-id">{ticket.id}</span>
                      <span 
                        className="priority-badge"
                        style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                    <h4>{ticket.subject}</h4>
                    <p className="requester">Requested by: {ticket.requesterName}</p>
                    <p className="description">{ticket.description}</p>
                    <div className="approval-actions">
                      <button 
                        onClick={() => handleQuickApprove(ticket.id, true)}
                        className="approve-btn"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleQuickApprove(ticket.id, false)}
                        className="reject-btn"
                      >
                        Reject
                      </button>
                    </div>
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
                <button className="action-btn primary">
                  📋 View All Tickets
                </button>
                <button className="action-btn secondary">
                  👥 Assign Tickets
                </button>
                <button className="action-btn success">
                  ✅ Bulk Resolve
                </button>
                <button className="action-btn info">
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
                  <div key={ticket.id} className="ticket-card">
                    <div className="ticket-header">
                      <span className="ticket-id">{ticket.id}</span>
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
                    <h4>{ticket.subject}</h4>
                    <div className="ticket-meta">
                      <span>Created: {new Date(ticket.createdDate).toLocaleDateString()}</span>
                      <span>SLA: {formatTimeRemaining(ticket.slaResolutionDue)}</span>
                    </div>
                    {(isTechnician() || isAdmin()) && ticket.status === 'Open' && (
                      <div className="ticket-actions">
                        <button 
                          onClick={() => handleQuickResolve(ticket.id, 'Quick resolution from dashboard')}
                          className="resolve-btn"
                        >
                          Quick Resolve
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {userTickets.length > 5 && (
                  <div className="view-all-link">
                    <a href="#tickets">View all {userTickets.length} tickets →</a>
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
