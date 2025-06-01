import React from 'react';
import TicketsTable from '../components/TicketsTable.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';
import './Dashboard.css';

function Dashboard() {
  return (
    <div className="dashboard-page">
      <ErrorBoundary>
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Welcome to your dashboard! Here you can manage your tickets and view statistics.</p>
        </div>
        
        <div className="dashboard-content">
          <div className="tickets-section">
            <h2>Tickets</h2>
            <TicketsTable />
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
}

export default Dashboard;
