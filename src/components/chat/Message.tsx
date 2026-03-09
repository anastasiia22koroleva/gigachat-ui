import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message as MessageType } from '../../types';
import './Message.css';

interface MessageProps {
  message: MessageType;
  onCopy: () => void;
}

export const Message: React.FC<MessageProps> = ({ message, onCopy }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`message ${message.role}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="message-avatar">
        {message.role === 'assistant' ? (
          <div className="gigachat-icon">G</div>
        ) : (
          <div className="user-icon">U</div>
        )}
      </div>

      <div className="message-content">
        <div className="message-header">
          <span className="message-name">
            {message.name || (message.role === 'assistant' ? 'GigaChat' : 'Вы')}
          </span>
          <span className="message-timestamp">
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>

        <div className="message-markdown">
          <ReactMarkdown>
            {message.content}
          </ReactMarkdown>
        </div>

        {isHovered && (
          <button
            className="message-copy"
            onClick={onCopy}
            aria-label="Copy message"
          >
            📋
          </button>
        )}
      </div>
    </div>
  );
};