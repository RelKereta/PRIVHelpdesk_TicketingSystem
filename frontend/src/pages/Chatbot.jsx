import React from 'react';
import './Chatbot.css';

function Chatbot() {
  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h1>AI Technical Support</h1>
      </div>
      <iframe
        className="chatbot-iframe"
        title="AI Technical Support Chat"
        src="https://denser.ai/u/embed/db1848cd-c0df-4526-976e-8bbbf9e1be76"
      />
    </div>
  );
}

export default Chatbot;
