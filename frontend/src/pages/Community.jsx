import React, { useState } from 'react';
import './Community.css';

function Community() {
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock data for department tickets
  const departmentTickets = [
    {
      id: 'TKT-001',
      title: 'Software License Renewal',
      department: 'IT',
      assignee: 'John Smith',
      status: 'In Progress',
      priority: 'Medium',
      created: '2024-01-15',
      lastUpdate: '2024-01-16'
    },
    {
      id: 'TKT-002',
      title: 'Marketing Campaign Assets',
      department: 'Marketing',
      assignee: 'Sarah Johnson',
      status: 'Open',
      priority: 'High',
      created: '2024-01-14',
      lastUpdate: '2024-01-14'
    },
    {
      id: 'TKT-003',
      title: 'Payroll System Update',
      department: 'HR',
      assignee: 'Mike Chen',
      status: 'Resolved',
      priority: 'High',
      created: '2024-01-12',
      lastUpdate: '2024-01-15'
    },
    {
      id: 'TKT-004',
      title: 'Office Equipment Request',
      department: 'Operations',
      assignee: 'Lisa Wang',
      status: 'Open',
      priority: 'Low',
      created: '2024-01-13',
      lastUpdate: '2024-01-13'
    },
    {
      id: 'TKT-005',
      title: 'Customer Database Backup',
      department: 'IT',
      assignee: 'David Brown',
      status: 'In Progress',
      priority: 'Critical',
      created: '2024-01-11',
      lastUpdate: '2024-01-16'
    },
    {
      id: 'TKT-006',
      title: 'Training Material Development',
      department: 'HR',
      assignee: 'Emily Davis',
      status: 'Open',
      priority: 'Medium',
      created: '2024-01-10',
      lastUpdate: '2024-01-10'
    }
  ];

  const departments = ['all', 'IT', 'Marketing', 'HR', 'Operations', 'Finance', 'Sales'];
  const statuses = ['all', 'Open', 'In Progress', 'Resolved', 'Closed'];

  const filteredTickets = departmentTickets.filter(ticket => {
    const matchesDepartment = selectedDepartment === 'all' || ticket.department === selectedDepartment;
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus;
    return matchesDepartment && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return '#dc3545';
      case 'In Progress': return '#ffc107';
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
      year: 'numeric'
    });
  };

  // Calculate department statistics
  const departmentStats = departments.slice(1).map(dept => {
    const deptTickets = departmentTickets.filter(ticket => ticket.department === dept);
    return {
      name: dept,
      total: deptTickets.length,
      open: deptTickets.filter(t => t.status === 'Open').length,
      inProgress: deptTickets.filter(t => t.status === 'In Progress').length,
      resolved: deptTickets.filter(t => t.status === 'Resolved').length
    };
  });

  return (
    <div className="community-page">
      <div className="community-header">
        <h1>Community</h1>
        <p>View and track tickets across all departments in your organization</p>
      </div>

      {/* Department Statistics */}
      <div className="department-stats">
        <h2>Department Overview</h2>
        <div className="stats-grid">
          {departmentStats.map(dept => (
            <div key={dept.name} className="dept-stat-card">
              <h3>{dept.name}</h3>
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
        <span>Showing {filteredTickets.length} of {departmentTickets.length} tickets</span>
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
            <div className="header-cell">Last Update</div>
          </div>
          
          {filteredTickets.map(ticket => (
            <div key={ticket.id} className="table-row">
              <div className="table-cell ticket-id">{ticket.id}</div>
              <div className="table-cell ticket-title">{ticket.title}</div>
              <div className="table-cell department">{ticket.department}</div>
              <div className="table-cell assignee">{ticket.assignee}</div>
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
              <div className="table-cell last-update">{formatDate(ticket.lastUpdate)}</div>
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
