import React, { useEffect, useRef } from 'react';
import { Message } from './Message';
import { Message as MessageType } from '../../types';
import './MessageList.css';

interface MessageListProps {
  messages: MessageType[];
  onCopyMessage: (id: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  onCopyMessage
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="message-list">
      {messages.map(message => (
        <Message
          key={message.id}
          message={message}
          onCopy={() => onCopyMessage(message.id)}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};