import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header({ onToggleSidebar, isSidebarExpanded }) {
  const location = useLocation();

  return (
    <header className={`header ${isSidebarExpanded ? 'sidebar-expanded' : ''}`}>
      <div className="header-left">
        <div className="toggle-btn" onClick={onToggleSidebar}>
          <div className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <Link to="/" className="logo-container">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 32c8.837 0 16-7.163 16-16S24.837 0 16 0 0 7.163 0 16s7.163 16 16 16zM8 16c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8-8-3.582-8-8z" fill="currentColor"/>
            </svg>
          </div>
          <span className="logo-text">PRIV</span>
        </Link>
      </div>

      <nav className="header-nav">
        <Link to="/solutions" className={location.pathname === '/solutions' ? 'active' : ''}>Solutions</Link>
        <Link to="/community" className={location.pathname === '/community' ? 'active' : ''}>Community</Link>
        <Link to="/resources" className={location.pathname === '/resources' ? 'active' : ''}>Resources</Link>
        <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
      </nav>
    </header>
  );
}

export default Header;
