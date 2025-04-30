import React, { useState } from 'react';
import Header from '../components/Header';
import './Chatbot.css';

function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI assistant. How can I help you with your technical issues today?", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    setMessages([...messages, { text: inputText, sender: 'user' }]);
    setInputText('');
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          text: "Thanks for your message. I'm here to help troubleshoot your issue. Could you provide more details about what's happening?", 
          sender: 'bot' 
        }
      ]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      <Header />
      <div className="chatbot-container">
        <div className="chatbot-header">
          <h1>AI Technical Support</h1>
        </div>
        
        <div className="chatbot-messages">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              {message.text}
            </div>
          ))}
        </div>
        
        <div className="chatbot-input">
          <input 
            type="text" 
            placeholder="Type your message here..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </>
  );
}

export default Chatbot;