import React from 'react';
import './EmptyState.css';

export const EmptyState: React.FC = () => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">💬</div>
      <h3 className="empty-state-title">Начните новый диалог</h3>
      <p className="empty-state-description">
        Задайте вопрос или напишите сообщение, чтобы начать общение с GigaChat
      </p>
    </div>
  );
};