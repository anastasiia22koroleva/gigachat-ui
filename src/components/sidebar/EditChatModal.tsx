import React, { useEffect, useState } from 'react';
import './EditChatModal.css';

interface EditChatModalProps {
  title: string;
  onClose: () => void;
  onSave: (title: string) => void;
}

export const EditChatModal: React.FC<EditChatModalProps> = ({
  title: initialTitle,
  onClose,
  onSave
}) => {
  const [value, setValue] = useState(initialTitle);

  useEffect(() => {
    setValue(initialTitle);
  }, [initialTitle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(value);
  };

  return (
    <div className="edit-chat-overlay" role="presentation">
      <div
        className="edit-chat-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-chat-title"
      >
        <h2 id="edit-chat-title" className="edit-chat-title">
          Переименовать чат
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="edit-chat-input"
            value={value}
            onChange={e => setValue(e.target.value)}
            autoFocus
            maxLength={120}
            aria-label="Название чата"
          />
          <div className="edit-chat-actions">
            <button
              type="button"
              className="edit-chat-btn edit-chat-btn--cancel"
              onClick={onClose}
            >
              Отмена
            </button>
            <button type="submit" className="edit-chat-btn edit-chat-btn--save">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
