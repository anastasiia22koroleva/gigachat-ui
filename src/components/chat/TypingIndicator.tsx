import React from 'react';
import './TypingIndicator.css';

interface TypingIndicatorProps {
  isVisible?: boolean;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  isVisible = true
}) => {
  if (!isVisible) {
    return null;
  }

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