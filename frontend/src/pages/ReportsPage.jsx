import React, { useState, useEffect } from 'react';
import { ticketService } from '../services/api';
import './ReportsPage.css';

function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportData, setReportData] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 365 days ago (1 year)
    endDate: new Date().toISOString().split('T')[0] // Today
  });
  const [totalTicketsCount, setTotalTicketsCount] = useState(0); // Debug info

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const ticketsData = await ticketService.getTickets();
      
      console.log('📊 Report Debug - Total tickets fetched:', ticketsData.length);
      console.log('📊 Report Debug - Sample ticket:', ticketsData[0]);
      setTotalTicketsCount(ticketsData.length);
      
      generateReport(ticketsData);
    } catch (err) {
      setError('Failed to fetch report data');
      console.error('📊 Report Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = (ticketData) => {
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    
    console.log('📊 Report Debug - Date range:', { startDate, endDate });
    console.log('📊 Report Debug - All tickets:', ticketData.length);
    
    // Filter tickets by date range
    const filteredTickets = ticketData.filter(ticket => {
      const createdDate = new Date(ticket.createdAt);
      const isInRange = createdDate >= startDate && createdDate <= endDate;
      if (!isInRange) {
        console.log('📊 Ticket filtered out:', ticket.ticketNumber, 'Created:', createdDate);
      }
      return isInRange;
    });

    console.log('📊 Report Debug - Filtered tickets:', filteredTickets.length);

    // Calculate various metrics
    const totalTickets = filteredTickets.length;
    const resolvedTickets = filteredTickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
    const openTickets = filteredTickets.filter(t => t.status === 'Open').length;
    const inProgressTickets = filteredTickets.filter(t => t.status === 'In Progress').length;
    
    // Priority breakdown
    const priorityBreakdown = {
      Critical: filteredTickets.filter(t => t.priority === 'Critical').length,
      High: filteredTickets.filter(t => t.priority === 'High').length,
      Medium: filteredTickets.filter(t => t.priority === 'Medium').length,
      Low: filteredTickets.filter(t => t.priority === 'Low').length
    };

    // Resolution rate
    const resolutionRate = totalTickets > 0 ? ((resolvedTickets / totalTickets) * 100).toFixed(1) : 0;

    // Average resolution time (for resolved tickets)
    const resolvedTicketsWithTime = filteredTickets.filter(t => 
      (t.status === 'Resolved' || t.status === 'Closed') && t.resolvedAt
    );
    
    let avgResolutionTime = 0;
    if (resolvedTicketsWithTime.length > 0) {
      const totalResolutionTime = resolvedTicketsWithTime.reduce((sum, ticket) => {
        const created = new Date(ticket.createdAt);
        const resolved = new Date(ticket.resolvedAt);
        return sum + (resolved - created);
      }, 0);
      avgResolutionTime = Math.round(totalResolutionTime / resolvedTicketsWithTime.length / (1000 * 60 * 60)); // in hours
    }

    // Tickets by date
    const ticketsByDate = {};
    filteredTickets.forEach(ticket => {
      const date = new Date(ticket.createdAt).toISOString().split('T')[0];
      ticketsByDate[date] = (ticketsByDate[date] || 0) + 1;
    });

    // Agent performance
    const agentPerformance = {};
    filteredTickets.forEach(ticket => {
      if (ticket.assignedTo) {
        const agentName = `${ticket.assignedTo.firstName} ${ticket.assignedTo.lastName}`;
        if (!agentPerformance[agentName]) {
          agentPerformance[agentName] = { total: 0, resolved: 0 };
        }
        agentPerformance[agentName].total++;
        if (ticket.status === 'Resolved' || ticket.status === 'Closed') {
          agentPerformance[agentName].resolved++;
        }
      }
    });

    setReportData({
      totalTickets,
      resolvedTickets,
      openTickets,
      inProgressTickets,
      priorityBreakdown,
      resolutionRate,
      avgResolutionTime,
      ticketsByDate,
      agentPerformance,
      dateRange: { startDate: dateRange.startDate, endDate: dateRange.endDate }
    });
  };

  const downloadReport = () => {
    if (!reportData) return;

    const csvContent = [
      ['Helpdesk Ticket Report'],
      [`Report Period: ${reportData.dateRange.startDate} to ${reportData.dateRange.endDate}`],
      [''],
      ['Summary Metrics'],
      ['Total Tickets', reportData.totalTickets],
      ['Resolved Tickets', reportData.resolvedTickets],
      ['Open Tickets', reportData.openTickets],
      ['In Progress Tickets', reportData.inProgressTickets],
      ['Resolution Rate (%)', reportData.resolutionRate],
      ['Average Resolution Time (hours)', reportData.avgResolutionTime],
      [''],
      ['Priority Breakdown'],
      ['Critical', reportData.priorityBreakdown.Critical],
      ['High', reportData.priorityBreakdown.High],
      ['Medium', reportData.priorityBreakdown.Medium],
      ['Low', reportData.priorityBreakdown.Low],
      [''],
      ['Agent Performance'],
      ['Agent Name', 'Total Tickets', 'Resolved Tickets', 'Resolution Rate (%)'],
      ...Object.entries(reportData.agentPerformance).map(([agent, stats]) => [
        agent,
        stats.total,
        stats.resolved,
        stats.total > 0 ? ((stats.resolved / stats.total) * 100).toFixed(1) : 0
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `helpdesk-report-${reportData.dateRange.startDate}-${reportData.dateRange.endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Ticket Reports</h1>
        <p>Analyze helpdesk performance and generate reports</p>
      </div>

      {/* Date Range Controls */}
      <div className="controls-section">
        <div className="date-controls">
          <div className="date-input-group">
            <label>Start Date:</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="date-input"
            />
          </div>
          <div className="date-input-group">
            <label>End Date:</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="date-input"
            />
          </div>
        </div>
        
        <div className="debug-info">
          <small>Total tickets in system: {totalTicketsCount}</small>
        </div>
        
        <button onClick={downloadReport} className="btn btn-primary" disabled={!reportData}>
          📊 Download Report (CSV)
        </button>
      </div>

      {reportData && (
        <div className="report-content">
          {totalTicketsCount > 0 && reportData.totalTickets === 0 && (
            <div className="error-message">
              ℹ️ Found {totalTicketsCount} tickets in system, but none in selected date range. Try extending the date range.
            </div>
          )}
          
          {/* Summary Cards */}
          <div className="summary-section">
            <h2>Summary Metrics</h2>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-icon">🎫</div>
                <div className="metric-value">{reportData.totalTickets}</div>
                <div className="metric-label">Total Tickets</div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">✅</div>
                <div className="metric-value">{reportData.resolvedTickets}</div>
                <div className="metric-label">Resolved</div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">📈</div>
                <div className="metric-value">{reportData.resolutionRate}%</div>
                <div className="metric-label">Resolution Rate</div>
              </div>
              <div className="metric-card">
                <div className="metric-icon">⏱️</div>
                <div className="metric-value">{reportData.avgResolutionTime}h</div>
                <div className="metric-label">Avg Resolution Time</div>
              </div>
            </div>
          </div>

          {/* Priority Breakdown */}
          <div className="chart-section">
            <h2>Priority Breakdown</h2>
            <div className="priority-chart">
              {Object.entries(reportData.priorityBreakdown).map(([priority, count]) => (
                <div key={priority} className="priority-bar">
                  <div className="priority-label">
                    <span className={`priority-indicator priority-${priority.toLowerCase()}`}></span>
                    {priority}
                  </div>
                  <div className="priority-bar-container">
                    <div 
                      className="priority-bar-fill"
                      style={{ 
                        width: `${reportData.totalTickets > 0 ? (count / reportData.totalTickets) * 100 : 0}%`,
                        backgroundColor: getPriorityColor(priority)
                      }}
                    ></div>
                  </div>
                  <div className="priority-count">{count}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="chart-section">
            <h2>Status Distribution</h2>
            <div className="status-chart">
              <div className="status-item">
                <span className="status-indicator status-open"></span>
                <span>Open: {reportData.openTickets}</span>
              </div>
              <div className="status-item">
                <span className="status-indicator status-progress"></span>
                <span>In Progress: {reportData.inProgressTickets}</span>
              </div>
              <div className="status-item">
                <span className="status-indicator status-resolved"></span>
                <span>Resolved: {reportData.resolvedTickets}</span>
              </div>
            </div>
          </div>

          {/* Agent Performance */}
          {Object.keys(reportData.agentPerformance).length > 0 && (
            <div className="chart-section">
              <h2>Agent Performance</h2>
              <div className="agent-performance-table">
                <table>
                  <thead>
                    <tr>
                      <th>Agent</th>
                      <th>Total Tickets</th>
                      <th>Resolved</th>
                      <th>Resolution Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(reportData.agentPerformance).map(([agent, stats]) => (
                      <tr key={agent}>
                        <td>{agent}</td>
                        <td>{stats.total}</td>
                        <td>{stats.resolved}</td>
                        <td>
                          {stats.total > 0 ? `${((stats.resolved / stats.total) * 100).toFixed(1)}%` : '0%'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  function getPriorityColor(priority) {
    switch (priority) {
      case 'Critical': return '#dc3545';
      case 'High': return '#fd7e14';
      case 'Medium': return '#ffc107';
      case 'Low': return '#28a745';
      default: return '#6c757d';
    }
  }
}

export default ReportsPage; 