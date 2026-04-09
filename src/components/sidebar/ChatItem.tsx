import React, { useState } from 'react';
import { Chat } from '../../types';
import './ChatItem.css';

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ChatItem: React.FC<ChatItemProps> = ({
  chat,
  isActive,
  onSelect,
  onEdit,
  onDelete
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Вчера';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
    }
  };

  return (
    <div
      className={`chat-item ${isActive ? 'active' : ''}`}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="chat-item-content">
        <div className="chat-item-title" title={chat.title}>
          {chat.title}
        </div>
        <div className="chat-item-date">
          {formatDate(chat.lastMessageDate)}
        </div>
      </div>

      {isHovered && (
        <div className="chat-item-actions">
          <button
            className="chat-item-action"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            aria-label="Редактировать чат"
          >
            Изм.
          </button>
          <button
            className="chat-item-action"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            aria-label="Удалить чат"
          >
            Уд.
          </button>
        </div>
      )}
    </div>
  );
};