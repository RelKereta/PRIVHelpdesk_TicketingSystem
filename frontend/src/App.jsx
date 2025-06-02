import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Solutions from './pages/Solutions';
import Community from './pages/Community';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import Chatbot from './pages/Chatbot';
import CreateTicket from './pages/CreateTicket';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import UserManagement from './pages/UserManagement';
import UserEdit from './pages/UserEdit';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TicketEdit from './pages/TicketEdit';

const ProtectedRoute = ({ children, requiredPermission = null }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/signin" />;
  if (requiredPermission && user.role !== 'admin') {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this page.</p>
      </div>
    );
  }
  return children;
};

const AuthenticatedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? <Navigate to="/dashboard" /> : children;
};

function AppContent() {
  const [collapsed, setCollapsed] = useState(false);
  const handleToggleSidebar = () => setCollapsed(!collapsed);

  const location = useLocation();
  const hideLayoutRoutes = ['/signin', '/signup'];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  useEffect(() => {
    const handleUnload = () => {};
    const handleVisibilityChange = () => {};
    window.addEventListener('unload', handleUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('unload', handleUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div className="app-container">
      {!shouldHideLayout && <Header onToggleSidebar={handleToggleSidebar} />}
      {!shouldHideLayout && <Sidebar collapsed={collapsed} />}
      <div className={`main-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <Routes>
          <Route path="/signin" element={<AuthenticatedRoute><SignIn /></AuthenticatedRoute>} />
          <Route path="/signup" element={<AuthenticatedRoute><SignUp /></AuthenticatedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/solutions" element={<ProtectedRoute><Solutions /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/user-management" element={<ProtectedRoute requiredPermission="user_management"><UserManagement /></ProtectedRoute>} />
          <Route path="/users/:id/edit" element={<ProtectedRoute requiredPermission="admin"><UserEdit /></ProtectedRoute>} />
          <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
          <Route path="/create-ticket" element={<ProtectedRoute><CreateTicket /></ProtectedRoute>} />
          <Route path="/tickets/:id/edit" element={<ProtectedRoute requiredPermission="admin"><TicketEdit /></ProtectedRoute>} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
