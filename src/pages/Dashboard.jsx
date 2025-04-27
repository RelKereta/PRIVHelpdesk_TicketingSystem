import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TicketsTable from '../components/TicketsTable';

function Dashboard() {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <Header />
        <TicketsTable />
      </div>
    </div>
  );
}

export default Dashboard;
