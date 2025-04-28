import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import TicketsTable from '../components/TicketsTable';

function Dashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

  return (
    <div className="dashboard">
      <Header isSidebarExpanded={!isSidebarCollapsed} />
      <Sidebar onCollapse={(collapsed) => setIsSidebarCollapsed(collapsed)} />
      <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <TicketsTable />
      </div>
    </div>
  );
}

export default Dashboard;
