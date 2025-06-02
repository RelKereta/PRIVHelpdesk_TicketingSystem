import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = React.forwardRef(({ collapsed }, ref) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (permission === 'ticket_management' && (user.role === 'agent' || user.role === 'admin')) return true;
    return false;
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return (firstName[0] || '') + (lastName[0] || '');
  };

  const getRoleDisplayName = () => {
    switch (user?.role) {
      case 'admin': return 'Administrator';
      case 'agent': return 'Technician';
      case 'user': return 'User';
      default: return 'User';
    }
  };

  const getRoleBadgeClass = () => {
    switch (user?.role) {
      case 'admin': return 'role-admin';
      case 'agent': return 'role-technician';
      case 'user': return 'role-user';
      default: return 'role-user';
    }
  };

  return (
    <aside ref={ref} className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Profile Section */}
      <div className="profile-section">
        <div className="profile-pic">
          {getUserInitials()}
        </div>
        <div className="profile-info">
          <h3>{user?.firstName} {user?.lastName}</h3>
          <p>{user?.email}</p>
          <span className={`role-badge ${getRoleBadgeClass()}`}>
            {getRoleDisplayName()}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {/* Main Section */}
        <div className="nav-section">
          <h4>Main</h4>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="nav-icon fas fa-home"></i>
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink to="/create-ticket" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="nav-icon fas fa-ticket-alt"></i>
            <span>Create Ticket</span>
          </NavLink>
        </div>

        {/* Tickets Section */}
        {hasPermission('ticket_management') && (
          <div className="nav-section">
            <h4>Tickets</h4>
            <NavLink to="/all-tickets" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <i className="nav-icon fas fa-list"></i>
              <span>All Tickets</span>
            </NavLink>
          </div>
        )}

        {/* Administration Section */}
        {isAdmin && (
          <div className="nav-section">
            <h4>Administration</h4>
            <NavLink to="/user-management" className={({ isActive }) => `nav-link admin-link ${isActive ? 'active' : ''}`}>
              <i className="nav-icon fas fa-users"></i>
              <span>User Management</span>
            </NavLink>
          </div>
        )}

        {/* Support Section */}
        <div className="nav-section">
          <h4>Support</h4>
          <NavLink to="/solutions" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="nav-icon fas fa-lightbulb"></i>
            <span>Solutions</span>
          </NavLink>

          <NavLink to="/community" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="nav-icon fas fa-comments"></i>
            <span>Community</span>
          </NavLink>

          <NavLink to="/resources" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="nav-icon fas fa-book"></i>
            <span>Resources</span>
          </NavLink>

          <NavLink to="/chatbot" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="nav-icon fas fa-robot"></i>
            <span>Chatbot</span>
          </NavLink>
        </div>

        {/* Settings Section */}
        <div className="nav-section">
          <h4>Account</h4>
          <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="nav-icon fas fa-user"></i>
            <span>Profile</span>
          </NavLink>
          
          <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <i className="nav-icon fas fa-cog"></i>
            <span>Settings</span>
          </NavLink>
        </div>
      </nav>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;