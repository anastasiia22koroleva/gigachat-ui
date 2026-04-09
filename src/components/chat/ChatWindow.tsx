import React, { useEffect } from 'react';
import { Navigate, useOutletContext, useParams } from 'react-router-dom';
import { MessageList } from './MessageList';
import { InputArea } from './InputArea';
import { EmptyState } from './EmptyState';
import { useChat } from '../../app/providers/ChatProvider';
import './ChatWindow.css';

interface ChatOutletContext {
  openSettings: () => void;
}

const noop = () => {};

export const ChatWindow: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { state, sendMessage, stopGeneration, setActiveChatId } = useChat();
  const outlet = useOutletContext<ChatOutletContext | null>();

  useEffect(() => {
    if (chatId) {
      setActiveChatId(chatId);
    }
  }, [chatId, setActiveChatId]);

  const chat = chatId ? state.chats.find(c => c.id === chatId) : undefined;
  const messages = chatId ? state.messagesByChatId[chatId] ?? [] : [];
  const isLoading = state.isSending;
  const openSettings = outlet?.openSettings ?? noop;

  if (!chatId || !chat) {
    return <Navigate to="/" replace />;
  }

  const showEmpty = messages.length === 0 && !isLoading;

  const handleCopyMessage = (_id: string) => {
    /* лог при необходимости */
  };

  return (
    <div className="chat-window">
      {state.error && (
        <div className="chat-error-banner" role="alert">
          {state.error}
        </div>
      )}
      <div className="chat-header">
        <h2 className="chat-title">{chat.title}</h2>
        <button
          type="button"
          className="chat-settings"
          onClick={openSettings}
          aria-label="Настройки"
        >
          <span className="chat-settings-label">Настройки</span>
        </button>
      </div>

      <div className="chat-messages">
        {showEmpty ? (
          <EmptyState />
        ) : (
          <MessageList
            messages={messages}
            isLoading={isLoading}
            onCopyMessage={handleCopyMessage}
          />
        )}
      </div>

      <div className="chat-input">
        <InputArea
          onSendMessage={content => sendMessage(chatId, content)}
          onStopGeneration={stopGeneration}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
