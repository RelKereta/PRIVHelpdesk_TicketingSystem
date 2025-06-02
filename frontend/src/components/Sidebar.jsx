import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ collapsed, onToggle }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';
  const isAgent = user?.role === 'agent';
  const isUser = user?.role === 'user';

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (permission === 'ticket_management' && (user.role === 'agent' || user.role === 'admin')) return true;
    return false;
  };

  const getUserInitials = () => {
    if (!user) return '';
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  const getRoleBadgeClass = () => {
    switch (user?.role) {
      case 'admin': return 'admin-badge';
      case 'agent': return 'agent-badge';
      default: return 'user-badge';
    }
  };

  const getRoleDisplayName = () => {
    switch (user?.role) {
      case 'admin': return 'Administrator';
      case 'agent': return 'Support Agent';
      default: return 'User';
    }
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-pic">
          {getUserInitials()}
        </div>
        {!collapsed && (
          <div className="profile-info">
            <h3>{user?.firstName} {user?.lastName}</h3>
            <p>{user?.email}</p>
            <span className={`role-badge ${getRoleBadgeClass()}`}>
              {getRoleDisplayName()}
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {/* Main Section */}
        <div className="nav-section">
          {!collapsed && <h4>Main</h4>}
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="nav-icon fas fa-home"></i>
            {!collapsed && <span>Dashboard</span>}
          </NavLink>
          
          <NavLink to="/create-ticket" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="nav-icon fas fa-ticket-alt"></i>
            {!collapsed && <span>Create Ticket</span>}
          </NavLink>
        </div>

        {/* Tickets Section - Only for agents and admins */}
        {(isAgent || isAdmin) && (
          <div className="nav-section">
            {!collapsed && <h4>Tickets</h4>}
            <NavLink to="/tickets" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <i className="nav-icon fas fa-list"></i>
              {!collapsed && <span>All Tickets</span>}
            </NavLink>
            <NavLink to="/community" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <i className="nav-icon fas fa-users"></i>
              {!collapsed && <span>Community</span>}
            </NavLink>
          </div>
        )}

        {/* Administration Section - Only for admins */}
        {isAdmin && (
          <div className="nav-section">
            {!collapsed && <h4>Administration</h4>}
            <NavLink to="/user-management" className={({ isActive }) => `nav-link admin-link ${isActive ? 'active' : ''}`}>
              <i className="nav-icon fas fa-users-cog"></i>
              {!collapsed && <span>User Management</span>}
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => `nav-link admin-link ${isActive ? 'active' : ''}`}>
              <i className="nav-icon fas fa-cog"></i>
              {!collapsed && <span>Settings</span>}
            </NavLink>
          </div>
        )}

        {/* Support Section - For all users */}
        <div className="nav-section">
          {!collapsed && <h4>Support</h4>}
          <NavLink to="/chatbot" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="nav-icon fas fa-robot"></i>
            {!collapsed && <span>Chat with Bot</span>}
          </NavLink>
          <NavLink to="/resources" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="nav-icon fas fa-book"></i>
            {!collapsed && <span>Resources</span>}
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="nav-icon fas fa-envelope"></i>
            {!collapsed && <span>Contact Support</span>}
          </NavLink>
        </div>

        {/* User Section */}
        <div className="nav-section">
          {!collapsed && <h4>Account</h4>}
          <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="nav-icon fas fa-user"></i>
            {!collapsed && <span>My Profile</span>}
          </NavLink>
          <button onClick={() => {
            localStorage.removeItem('user');
            window.location.href = '/signin';
          }} className="nav-link logout-link">
            <i className="nav-icon fas fa-sign-out-alt"></i>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;