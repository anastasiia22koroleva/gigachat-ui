import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import './InputArea.css';

interface InputAreaProps {
  onSendMessage: (content: string) => void;
  onStopGeneration: () => void;
  isGenerating: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({
  onSendMessage,
  onStopGeneration,
  isGenerating
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [message]);

  const handleSubmit = () => {
    if (message.trim() && !isGenerating) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleAttach = () => {
    console.log('Attach file');
  };

  return (
    <div className="input-area">
      <button
        className="input-attach"
        onClick={handleAttach}
        aria-label="Attach file"
      >
        📎
      </button>

      <div className="input-wrapper">
        <textarea
          ref={textareaRef}
          className="input-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введите сообщение..."
          rows={1}
        />

        {isGenerating ? (
          <Button
            variant="danger"
            size="medium"
            onClick={onStopGeneration}
            className="input-stop"
          >
            ⏹ Стоп
          </Button>
        ) : (
          <Button
            variant="primary"
            size="medium"
            onClick={handleSubmit}
            disabled={!message.trim()}
            className="input-send"
          >
            ➤
          </Button>
        )}
      </div>
    </div>
  );
};