import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({ collapsed, onToggleSidebar }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/dashboard':
        return 'Dashboard';
      case '/create-ticket':
        return 'Create Ticket';
      case '/tickets':
        return 'All Tickets';
      case '/user-management':
        return 'User Management';
      case '/settings':
        return 'Settings';
      case '/profile':
        return 'My Profile';
      case '/chatbot':
        return 'Chat with Bot';
      case '/resources':
        return 'Resources';
      case '/contact':
        return 'Contact Support';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <button 
          className="sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <i className={`fas ${collapsed ? 'fa-bars' : 'fa-times'}`}></i>
        </button>
        <h1>{getPageTitle()}</h1>
      </div>
      
      <div className="header-right">
        <div className="user-menu">
          <div className="user-info">
            <span className="user-name">{user?.firstName} {user?.lastName}</span>
            <span className="user-role">{user?.role}</span>
          </div>
          <div className="user-avatar">
            {`${user?.firstName[0]}${user?.lastName[0]}`.toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
