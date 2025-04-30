import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Solutions from './pages/Solutions';
import Community from './pages/Community';
import Resources from './pages/Resources';
import Contact from './pages/Contact';
import Chatbot from './pages/Chatbot';
import CreateTicket from './pages/CreateTicket';
import SignIn from './pages/SignIn';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to /signin */}
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/community" element={<Community />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/create-ticket" element={<CreateTicket />} />
        {/* Redirect all unknown routes to /signin */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
