import React, { useState } from 'react';
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
    </div>
  );
}

export default Sidebar;
