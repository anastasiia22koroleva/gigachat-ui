import React from 'react';
import { ChatList } from './ChatList';
import { SearchInput } from './SearchInput';
import { Button } from '../ui/Button';
import { Chat } from '../../types';
import './Sidebar.css';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string;
  onChatSelect: (id: string) => void;
  onNewChat: () => void;
  onSearch: (query: string) => void;
  onEditChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChatId,
  onChatSelect,
  onNewChat,
  onSearch,
  onEditChat,
  onDeleteChat
}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Button
          variant="primary"
          size="medium"
          fullWidth
          onClick={onNewChat}
        >
          <span className="new-chat-icon">+</span>
          Новый чат
        </Button>
      </div>

      <div className="sidebar-search">
        <SearchInput onSearch={onSearch} />
      </div>

      <ChatList
        chats={chats}
        activeChatId={activeChatId}
        onChatSelect={onChatSelect}
        onEditChat={onEditChat}
        onDeleteChat={onDeleteChat}
      />
    </div>
  );
};