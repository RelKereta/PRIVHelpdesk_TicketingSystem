import React, { useEffect } from 'react';

function DenserChatbot() {
  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.type = 'module';
    script.innerHTML = `
      import Chatbot from "https://cdn.jsdelivr.net/npm/@denserai/embed-chat@1/dist/web.min.js";
      Chatbot.init({
        chatbotId: "db1848cd-c0df-4526-976e-8bbbf9e1be76",
      });
    `;
    
    // Append script to document
    document.body.appendChild(script);

    // Cleanup function
    return () => {
      document.body.removeChild(script);
    };
  }, []); // Empty dependency array means this runs once on mount

  return null; // This component doesn't render anything visible
}

export default DenserChatbot; 