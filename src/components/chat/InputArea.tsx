import React, { useState } from 'react';
import { Button } from '../ui/Button';
import './InputArea.css';

interface InputAreaProps {
  onSendMessage: (content: string) => void;
  onStopGeneration: () => void;
  isLoading: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({
  onSendMessage,
  onStopGeneration,
  isLoading
}) => {
  const [message, setMessage] = useState('');

  const canSubmit = Boolean(message.trim()) && !isLoading;

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }
    onSendMessage(message.trim());
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.shiftKey) {
      return;
    }
    e.preventDefault();
    if (!canSubmit) {
      return;
    }
    handleSubmit();
  };

  const handleAttach = () => {
    console.log('Attach file');
  };

  return (
    <div className="input-area">
      <button
        type="button"
        className="input-attach"
        onClick={handleAttach}
        aria-label="Прикрепить файл"
      >
        <span className="input-attach-label">Влож.</span>
      </button>

      <div className="input-wrapper">
        <textarea
          className="input-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введите сообщение..."
          rows={1}
          disabled={isLoading}
          aria-label="Текст сообщения"
        />

        {isLoading ? (
          <Button
            variant="danger"
            size="medium"
            type="button"
            onClick={onStopGeneration}
            className="input-stop"
          >
            Стоп
          </Button>
        ) : (
          <Button
            variant="primary"
            size="medium"
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="input-send"
          >
            Отправить
          </Button>
        )}
      </div>
    </div>
  );
};
