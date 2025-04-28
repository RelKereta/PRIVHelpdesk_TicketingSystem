<<<<<<< HEAD
import React, { useState } from 'react';
=======
import React from 'react';
>>>>>>> 7059d9936a4d3662c2ec06ce3e0d388088e365f0
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TicketsTable from '../components/TicketsTable';

function Dashboard() {
<<<<<<< HEAD
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  return (
    <div className="dashboard">
      <Header isSidebarExpanded={!isSidebarCollapsed} />
      <Sidebar onCollapse={(collapsed) => setIsSidebarCollapsed(collapsed)} />
      <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
=======
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">
        <Header />
>>>>>>> 7059d9936a4d3662c2ec06ce3e0d388088e365f0
        <TicketsTable />
      </div>
    </div>
  );
}

export default Dashboard;
