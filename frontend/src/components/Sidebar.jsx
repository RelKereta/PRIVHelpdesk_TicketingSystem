import React, { useState } from 'react';
import './Sidebar.css';

function Sidebar({ onCollapse }) {
  const [collapsed, setCollapsed] = useState(true);

  const handleToggle = () => {
    setCollapsed(!collapsed);
    onCollapse();
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="toggle-btn" onClick={handleToggle}>
        <div className="hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      {!collapsed && (
        <>
          <div className="profile-section">
            <div className="profile-pic"></div>
            <div className="profile-info">
              <h3>Random Name</h3>
              <p>Senior Creative Director</p>
            </div>
          </div>
          <nav className="sidebar-nav">
            <a href="#dashboard">Dashboard</a>
            <a href="#tickets">Tickets</a>
            <a href="#settings">Settings</a>
            <a href="#profile">Profile</a>
          </nav>
        </>
      )}
    </div>
  );
}

export default Sidebar;
