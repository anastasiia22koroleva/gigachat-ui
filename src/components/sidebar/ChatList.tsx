import React from 'react';
import { ChatItem } from './ChatItem';
import { Chat } from '../../types';
import './ChatList.css';

interface ChatListProps {
  chats: Chat[];
  activeChatId: string;
  onChatSelect: (id: string) => void;
  onEditChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChatId,
  onChatSelect,
  onEditChat,
  onDeleteChat
}) => {
  return (
    <div className="chat-list">
      {chats.map(chat => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isActive={chat.id === activeChatId}
          onSelect={() => onChatSelect(chat.id)}
          onEdit={() => onEditChat(chat.id)}
          onDelete={() => onDeleteChat(chat.id)}
        />
      ))}
    </div>
  );
};