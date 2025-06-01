import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

function Sidebar({ collapsed }) {
  const { user, hasPermission } = useAuth();

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {!collapsed && (
        <>
          <div className="profile-section">
            <div className="profile-pic">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="profile-info">
              <h3>{user?.name || 'User'}</h3>
              <p>{user?.position || 'Employee'}</p>
              <span className={`role-badge role-${user?.role}`}>
                {user?.role?.toUpperCase() || 'USER'}
              </span>
            </div>
          </div>
          
          <nav className="sidebar-nav">
            <div className="nav-section">
              <h4>Main</h4>
              <Link to="/dashboard" className="nav-link">
                <span className="nav-icon">📊</span>
                Dashboard
              </Link>
              <Link to="/create-ticket" className="nav-link">
                <span className="nav-icon">🎫</span>
                Create Ticket
              </Link>
              <Link to="/chatbot" className="nav-link">
                <span className="nav-icon">🤖</span>
                AI Support
              </Link>
            </div>

            <div className="nav-section">
              <h4>Knowledge</h4>
              <Link to="/solutions" className="nav-link">
                <span className="nav-icon">💡</span>
                Solutions
              </Link>
              <Link to="/resources" className="nav-link">
                <span className="nav-icon">📚</span>
                Resources
              </Link>
              <Link to="/community" className="nav-link">
                <span className="nav-icon">👥</span>
                Community
              </Link>
            </div>

            {/* Admin-only section */}
            {hasPermission('user_management') && (
              <div className="nav-section">
                <h4>Administration</h4>
                <Link to="/user-management" className="nav-link admin-link">
                  <span className="nav-icon">👨‍💼</span>
                  User Management
                </Link>
              </div>
            )}

            <div className="nav-section">
              <h4>Support</h4>
              <Link to="/contact" className="nav-link">
                <span className="nav-icon">📞</span>
                Contact
              </Link>
            </div>

            <div className="nav-section">
              <h4>Account</h4>
              <Link to="/profile" className="nav-link">
                <span className="nav-icon">👤</span>
                Profile
              </Link>
              <Link to="/settings" className="nav-link">
                <span className="nav-icon">⚙️</span>
                Settings
              </Link>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}

export default Sidebar;