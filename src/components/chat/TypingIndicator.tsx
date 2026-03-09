import React from 'react';
import './TypingIndicator.css';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="typing-indicator">
      <div className="typing-avatar">
        <div className="gigachat-icon">G</div>
      </div>
      <div className="typing-dots">
        <span className="typing-dot"></span>
        <span className="typing-dot"></span>
        <span className="typing-dot"></span>
      </div>
    </div>
  );
};