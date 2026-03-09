import React from 'react';
import { MessageList } from './MessageList';
import { InputArea } from './InputArea';
import { TypingIndicator } from './TypingIndicator';
import { EmptyState } from './EmptyState';
import { Message } from '../../types';
import './ChatWindow.css';

interface ChatWindowProps {
  chatTitle: string;
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (content: string) => void;
  onStopGeneration: () => void;
  onOpenSettings: () => void;
  onCopyMessage: (id: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chatTitle,
  messages,
  isTyping,
  onSendMessage,
  onStopGeneration,
  onOpenSettings,
  onCopyMessage
}) => {
  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2 className="chat-title">{chatTitle}</h2>
        <button
          className="chat-settings"
          onClick={onOpenSettings}
          aria-label="Settings"
        >
          ⚙️
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <MessageList
              messages={messages}
              onCopyMessage={onCopyMessage}
            />
            {isTyping && <TypingIndicator />}
          </>
        )}
      </div>

      <div className="chat-input">
        <InputArea
          onSendMessage={onSendMessage}
          onStopGeneration={onStopGeneration}
          isGenerating={isTyping}
        />
      </div>
    </div>
  );
};