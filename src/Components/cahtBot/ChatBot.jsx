import React, { useEffect } from 'react';
import './chatbot.css'

// Custom hook for loading an external script
const useExternalScript = (src, attributes = {}) => {
  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;

    // Add any additional attributes
    Object.keys(attributes).forEach(key => {
      script.setAttribute(key, attributes[key]);
    });

    // Append script to the body
    document.body.appendChild(script);

    // Remove script on component unmount
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [src, attributes]); // Only re-run effect if script src or attributes change
};

const ChatbotComponent = () => {
  // Set the chatbot configuration on the window object
  useEffect(() => {
    window.embeddedChatbotConfig = {
      chatbotId: "KGp8Naihd8SiJDz8wXb2z",
      domain: "www.chatbase.co"
    };
  }, []);

  // Attributes for the script
  const attributes = {
    chatbotId: "KGp8Naihd8SiJDz8wXb2z",
    domain: "www.chatbase.co"
  };

  // Load the external script
  useExternalScript("https://www.chatbase.co/embed.min.js", attributes);

  return (
    <div>
      {/* Placeholder for chatbot if needed */}
    </div>
  );
};

export default ChatbotComponent;