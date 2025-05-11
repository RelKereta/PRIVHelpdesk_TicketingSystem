import React, { useState } from 'react';
import './Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm your AI assistant. How can I help you with your technical issues today?",
      sender: 'bot',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    setMessages(prev => [...prev, { text: trimmed, sender: 'user' }]);
    setInputText('');

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          text:
            "Thanks for your message. I'm here to help troubleshoot your issue. Could you provide more details about what's happening?",
          sender: 'bot',
        },
      ]);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h1>AI Technical Support</h1>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chatbot-input">
        <input
          type="text"
          placeholder="Type your message here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;
