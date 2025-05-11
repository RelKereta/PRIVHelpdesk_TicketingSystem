import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ collapsed }) {
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
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
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/tickets">Tickets</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/profile">Profile</Link>
          </nav>
        </>
      )}
    </div>
  );
}

export default Sidebar;