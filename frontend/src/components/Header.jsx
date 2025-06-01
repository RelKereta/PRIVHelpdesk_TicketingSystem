import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header({ onToggleSidebar }) {
  const location = useLocation();

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
    </header>
  );
}

export default Header;
