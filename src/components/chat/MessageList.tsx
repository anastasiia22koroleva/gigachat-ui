import React, { useEffect, useRef } from 'react';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';
import { Message as MessageType } from '../../types';
import './MessageList.css';

interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
  onCopyMessage: (id: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  onCopyMessage
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="message-list">
      {messages.map(message => (
        <Message
          key={message.id}
          message={message}
          variant={message.role}
          onCopy={() => onCopyMessage(message.id)}
        />
      ))}
      <TypingIndicator isVisible={isLoading} />
      <div ref={bottomRef} />
    </div>
  );
};