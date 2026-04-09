import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../providers/ChatProvider';
import { EmptyState } from '../../components/chat/EmptyState';
import './HomeRoute.css';

/** Маршрут / — перенаправление на последний/первый чат или пустой экран */
export const HomeRoute: React.FC = () => {
  const { state } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.chats.length === 0) {
      return;
    }
    const preferred =
      state.activeChatId &&
      state.chats.some(c => c.id === state.activeChatId)
        ? state.activeChatId
        : state.chats[0].id;
    navigate(`/chat/${preferred}`, { replace: true });
  }, [state.chats, state.activeChatId, navigate]);

  if (state.chats.length > 0) {
    return (
      <div className="home-route-loading" aria-hidden>
        Загрузка…
      </div>
    );
  }

  return (
    <div className="home-route-empty">
      <EmptyState />
      <p className="home-route-hint">
        Нажмите «Новый чат» в боковой панели, чтобы начать.
      </p>
    </div>
  );
};
