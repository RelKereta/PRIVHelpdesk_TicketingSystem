import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header({ onToggleSidebar }) {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    signOut();
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="toggle-button" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          ☰
        </button>
        <Link to="/" className="logo">
          <div className="logo-icon">
            P
          </div>
          <span className="logo-text">PRIV</span>
        </Link>
      </div>

      <nav className="header-nav">
        <Link 
          to="/solutions" 
          className={`nav-link ${location.pathname === '/solutions' ? 'active' : ''}`}
        >
          Solutions
        </Link>
        <Link 
          to="/community" 
          className={`nav-link ${location.pathname === '/community' ? 'active' : ''}`}
        >
          Community
        </Link>
        <Link 
          to="/resources" 
          className={`nav-link ${location.pathname === '/resources' ? 'active' : ''}`}
        >
          Resources
        </Link>
        <Link 
          to="/contact" 
          className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
        >
          Contact
        </Link>
      </nav>

      {user && (
        <div className="header-right">
          <span className="user-greeting">Hello, {user.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
