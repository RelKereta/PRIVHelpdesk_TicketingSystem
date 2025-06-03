import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ticketService } from '../services/api';
import './Community.css';

function Community() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Default departments that should always be shown
  const defaultDepartments = ['IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Sales', 'Legal', 'Customer Support'];

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tickets, selectedDepartment, selectedStatus]);

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

  const applyFilters = () => {
    let filtered = [...tickets];

    // Apply department filter
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(ticket => 
        ticket.requester && ticket.requester.department === selectedDepartment
      );
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === selectedStatus);
    }

    setFilteredTickets(filtered);
  };

  // Get all unique departments from tickets + default departments
  const getAllDepartments = () => {
    const ticketDepartments = [...new Set(tickets.map(ticket => 
      ticket.requester?.department
    ).filter(Boolean))];
    
    // Combine default departments with departments found in tickets
    const allDepartments = [...new Set([...defaultDepartments, ...ticketDepartments])];
    return ['all', ...allDepartments.sort()];
  };

  const departments = getAllDepartments();
  const statuses = ['all', 'Open', 'In Progress', 'Resolved', 'Closed'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return '#dc3545';
      case 'In Progress': return '#007bff';
      case 'Resolved': return '#28a745';
      case 'Closed': return '#6c757d';
      default: return '#007bff';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Low': return '#28a745';
      case 'Medium': return '#ffc107';
      case 'High': return '#fd7e14';
      case 'Critical': return '#dc3545';
      default: return '#007bff';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate comprehensive department statistics
  const calculateDepartmentStats = () => {
    return departments.slice(1).map(dept => {
      const deptTickets = tickets.filter(ticket => 
        ticket.requester?.department === dept
      );
      
      // Calculate various metrics for each department
      const stats = {
        name: dept,
        total: deptTickets.length,
        open: deptTickets.filter(t => t.status === 'Open').length,
        inProgress: deptTickets.filter(t => t.status === 'In Progress').length,
        resolved: deptTickets.filter(t => t.status === 'Resolved').length,
        closed: deptTickets.filter(t => t.status === 'Closed').length,
        // Priority breakdown
        critical: deptTickets.filter(t => t.priority === 'Critical').length,
        high: deptTickets.filter(t => t.priority === 'High').length,
        medium: deptTickets.filter(t => t.priority === 'Medium').length,
        low: deptTickets.filter(t => t.priority === 'Low').length,
        // Performance metrics
        resolutionRate: 0,
        avgResolutionTime: 0,
        overdue: 0
      };

      // Calculate resolution rate
      const resolvedAndClosed = stats.resolved + stats.closed;
      stats.resolutionRate = stats.total > 0 ? Math.round((resolvedAndClosed / stats.total) * 100) : 0;

      // Calculate average resolution time (in hours)
      const resolvedTickets = deptTickets.filter(t => 
        (t.status === 'Resolved' || t.status === 'Closed') && t.resolvedAt
      );
      
      if (resolvedTickets.length > 0) {
        const totalResolutionTime = resolvedTickets.reduce((sum, ticket) => {
          const created = new Date(ticket.createdAt);
          const resolved = new Date(ticket.resolvedAt);
          return sum + (resolved - created);
        }, 0);
        stats.avgResolutionTime = Math.round(totalResolutionTime / resolvedTickets.length / (1000 * 60 * 60));
      }

      // Calculate overdue tickets
      stats.overdue = deptTickets.filter(t => 
        t.slaDeadline && 
        new Date(t.slaDeadline) < new Date() && 
        t.status !== 'Resolved' && 
        t.status !== 'Closed'
      ).length;

      return stats;
    }).filter(dept => dept.total > 0 || defaultDepartments.includes(dept.name)); // Show department if it has tickets or is a default department
  };

  const departmentStats = calculateDepartmentStats();

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

  return (
    <div className="community-page">
      <div className="community-header">
        <h1>Community</h1>
        <p>View and track tickets across all departments in your organization</p>
      </div>

      {/* Department Statistics */}
      <div className="department-stats">
        <h2>Department Overview</h2>
        <div className="stats-summary">
          <div className="summary-card">
            <h3>Total Departments</h3>
            <span className="summary-number">{departmentStats.length}</span>
          </div>
          <div className="summary-card">
            <h3>Total Tickets</h3>
            <span className="summary-number">{tickets.length}</span>
          </div>
          <div className="summary-card">
            <h3>Active Departments</h3>
            <span className="summary-number">{departmentStats.filter(d => d.total > 0).length}</span>
          </div>
          <div className="summary-card">
            <h3>Avg Resolution Rate</h3>
            <span className="summary-number">
              {departmentStats.length > 0 ? 
                Math.round(departmentStats.reduce((sum, d) => sum + d.resolutionRate, 0) / departmentStats.filter(d => d.total > 0).length) || 0
                : 0}%
            </span>
          </div>
        </div>
        
        <div className="stats-grid">
          {departmentStats.map(dept => (
            <div key={dept.name} className={`dept-stat-card ${dept.total === 0 ? 'no-tickets' : ''}`}>
              <div className="dept-header">
                <h3>{dept.name}</h3>
                {dept.overdue > 0 && (
                  <span className="overdue-badge">⚠️ {dept.overdue} overdue</span>
                )}
              </div>
              
              <div className="stat-numbers">
                <div className="stat-item">
                  <span className="number">{dept.total}</span>
                  <span className="label">Total</span>
                </div>
                <div className="stat-item">
                  <span className="number open">{dept.open}</span>
                  <span className="label">Open</span>
                </div>
                <div className="stat-item">
                  <span className="number progress">{dept.inProgress}</span>
                  <span className="label">In Progress</span>
                </div>
                <div className="stat-item">
                  <span className="number resolved">{dept.resolved}</span>
                  <span className="label">Resolved</span>
                </div>
              </div>

              {dept.total > 0 && (
                <div className="dept-metrics">
                  <div className="metric-row">
                    <span className="metric-label">Resolution Rate:</span>
                    <span className={`metric-value ${dept.resolutionRate >= 80 ? 'good' : dept.resolutionRate >= 60 ? 'average' : 'poor'}`}>
                      {dept.resolutionRate}%
                    </span>
                  </div>
                  {dept.avgResolutionTime > 0 && (
                    <div className="metric-row">
                      <span className="metric-label">Avg Resolution:</span>
                      <span className="metric-value">{dept.avgResolutionTime}h</span>
                    </div>
                  )}
                  <div className="priority-breakdown">
                    <span className="breakdown-label">Priority Mix:</span>
                    <div className="priority-bars">
                      {dept.critical > 0 && <span className="priority-bar critical" title={`${dept.critical} Critical`}></span>}
                      {dept.high > 0 && <span className="priority-bar high" title={`${dept.high} High`}></span>}
                      {dept.medium > 0 && <span className="priority-bar medium" title={`${dept.medium} Medium`}></span>}
                      {dept.low > 0 && <span className="priority-bar low" title={`${dept.low} Low`}></span>}
                    </div>
                  </div>
                </div>
              )}
              
              {dept.total === 0 && (
                <div className="no-tickets-message">
                  <span>No tickets yet</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="community-controls">
        <div className="filter-group">
          <label>Department:</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="filter-select"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept === 'all' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Status:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Counter */}
      <div className="results-info">
        <span>Showing {filteredTickets.length} of {tickets.length} tickets</span>
      </div>

      {/* Tickets Table */}
      <div className="tickets-container">
        <div className="tickets-table">
          <div className="table-header">
            <div className="header-cell">Ticket ID</div>
            <div className="header-cell">Title</div>
            <div className="header-cell">Department</div>
            <div className="header-cell">Assignee</div>
            <div className="header-cell">Status</div>
            <div className="header-cell">Priority</div>
            <div className="header-cell">Requester</div>
            <div className="header-cell">Created</div>
            <div className="header-cell">Actions</div>
          </div>
          
          {filteredTickets
            .filter(ticket => {
              // Only show tickets the user can actually access
              const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
              if (!currentUser._id) return false;
              return currentUser.role === 'admin' || 
                     currentUser.role === 'agent' || 
                     ticket.requester?.userId?.toString() === currentUser._id?.toString();
            })
            .map(ticket => (
            <div key={ticket._id} className="table-row">
              <div className="table-cell ticket-id">{ticket.ticketNumber}</div>
              <div className="table-cell ticket-title">{ticket.title}</div>
              <div className="table-cell department">{ticket.requester?.department || 'N/A'}</div>
              <div className="table-cell assignee">
                {ticket.assignee ? 
                  `${ticket.assignee.username}` : 
                  'Unassigned'
                }
              </div>
              <div className="table-cell">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(ticket.status) }}
                >
                  {ticket.status}
                </span>
              </div>
              <div className="table-cell">
                <span 
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                >
                  {ticket.priority}
                </span>
              </div>
              <div className="table-cell requester">{ticket.requester?.username || 'Unknown'}</div>
              <div className="table-cell created">{formatDate(ticket.createdAt)}</div>
              <div className="table-cell actions">
                {/* All visible tickets now have View access */}
                <Link 
                  to={`/tickets/${ticket._id}`}
                  className="btn-sm btn-primary"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredTickets.length === 0 && (
        <div className="no-results">
          <h3>No tickets found</h3>
          <p>Try adjusting your filters to see more tickets.</p>
        </div>
      )}
    </div>
  );
}

export default Community;
