import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Components } from 'react-markdown';
import { Message as MessageType } from '../../types';
import './Message.css';

interface MessageProps {
  message: MessageType;
  onCopy: () => void;
  variant?: 'user' | 'assistant';
}

export const Message: React.FC<MessageProps> = ({
  message,
  onCopy,
  variant
}) => {
  const messageVariant = variant ?? message.role;
  const [copied, setCopied] = useState(false);
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current !== null) {
        clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyClick = async () => {
    if (messageVariant !== 'assistant') {
      return;
    }
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      onCopy();
      if (copiedTimeoutRef.current !== null) {
        clearTimeout(copiedTimeoutRef.current);
      }
      copiedTimeoutRef.current = setTimeout(() => {
        setCopied(false);
        copiedTimeoutRef.current = null;
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  const markdownComponents: Components = {
    code({ className, children }) {
      const inline = !className;
      const match = /language-(\w+)/.exec(className || '');
      const codeText = String(children).replace(/\n$/, '');
      if (!inline && match) {
        return (
          <SyntaxHighlighter
            language={match[1]}
            style={oneDark}
            PreTag="div"
            className="message-code-block"
          >
            {codeText}
          </SyntaxHighlighter>
        );
      }
      return <code className={className}>{children}</code>;
    }
  };

  return (
    <div className={`message ${messageVariant}`}>
      <div className="message-avatar">
        {messageVariant === 'assistant' ? (
          <div className="gigachat-icon">G</div>
        ) : (
          <div className="user-icon">U</div>
        )}
      </div>

      <div className="message-content">
        <div className="message-header">
          <span className="message-name">
            {message.name ||
              (messageVariant === 'assistant' ? 'GigaChat' : 'Вы')}
          </span>
          <span className="message-timestamp">
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>

        <div className="message-markdown">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {messageVariant === 'assistant' && (
          <button
            type="button"
            className={`message-copy${copied ? ' message-copy--copied' : ''}`}
            onClick={handleCopyClick}
            aria-label={copied ? 'Скопировано' : 'Копировать сообщение'}
          >
            {copied ? 'Скопировано' : 'Копировать'}
          </button>
        )}
      </div>
    </div>
  );
};
