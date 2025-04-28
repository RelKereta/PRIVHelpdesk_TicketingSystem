import React, { useState } from 'react';
<<<<<<< HEAD
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
=======
import { Link } from 'react-router-dom';

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
        ☰
      </div>
      <div className="profile-section">
        <div className="profile-pic"></div>
        {!collapsed && (
          <div>
            <h3>Random Name</h3>
            <p>Senior Creative Director</p>
          </div>
        )}
      </div>
      <nav>
        <Link to="/solutions">Solutions</Link>
        <Link to="/community">Community</Link>
        <Link to="/resources">Resources</Link>
        <Link to="/contact">Contact</Link>
      </nav>
>>>>>>> 7059d9936a4d3662c2ec06ce3e0d388088e365f0
    </div>
  );
}

export default Sidebar;
