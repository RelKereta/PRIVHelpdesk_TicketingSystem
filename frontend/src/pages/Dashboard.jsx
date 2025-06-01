import React from 'react';
import TicketsTable from '../components/TicketsTable.jsx';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

function Dashboard() {
  return (
    <div className="dashboard">
      <ErrorBoundary>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="mb-6">Welcome to your dashboard! Here you can manage your tickets and view statistics.</p>
        <TicketsTable />
      </ErrorBoundary>
    </div>
  );
}

export default Dashboard;
