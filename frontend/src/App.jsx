import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TicketProvider } from './context/TicketContext'; // ✅ import TicketProvider

import Dashboard from './pages/Dashboard';
import Solutions from './pages/Solutions';
import Community from './pages/Community';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import Chatbot from './pages/Chatbot';
import CreateTicket from './pages/CreateTicket';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// These must be declared inside children of AuthProvider
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/signin" />;
};

const AuthenticatedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" /> : children;
};

function AppContent() {
  const [collapsed, setCollapsed] = useState(true);
  const handleToggleSidebar = () => setCollapsed(!collapsed);

  useEffect(() => {
    window.addEventListener('unload', () => {});
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {}
    });
    return () => {
      window.removeEventListener('unload', () => {});
      document.removeEventListener('visibilitychange', () => {});
    };
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Header onToggleSidebar={handleToggleSidebar} isSidebarExpanded={!collapsed} />
        <Sidebar collapsed={collapsed} />
        <div className="main-content">
          <Routes>
            <Route
              path="/signin"
              element={
                <AuthenticatedRoute>
                  <SignIn />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthenticatedRoute>
                  <SignUp />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/solutions"
              element={
                <ProtectedRoute>
                  <Solutions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/community"
              element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resources"
              element={
                <ProtectedRoute>
                  <Resources />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <ProtectedRoute>
                  <Contact />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chatbot"
              element={
                <ProtectedRoute>
                  <Chatbot />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-ticket"
              element={
                <ProtectedRoute>
                  <CreateTicket />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <TicketProvider>
        <AppContent />
      </TicketProvider>
    </AuthProvider>
  );
}

export default App;
