import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/sidebar/Sidebar';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EditChatModal } from '../../components/sidebar/EditChatModal';
import { Toggle } from '../../components/ui';
import { SettingsPanel } from '../../components/settings';
import { useChat } from '../providers/ChatProvider';
import type { Chat } from '../../types';
import type { Settings } from '../../types';
function entityToChat(
  e: import('../../types/chatState').ChatEntity
): Chat {
  return {
    id: e.id,
    title: e.title,
    lastMessageDate: new Date(e.lastMessageDate),
    lastMessagePreview: e.lastMessagePreview
  };
}

interface MainLayoutProps {
  isDark: boolean;
  onThemeChange: (checked: boolean) => void;
  settings: Settings;
  onSaveSettings: (s: Settings) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  isDark,
  onThemeChange,
  settings,
  onSaveSettings
}) => {
  const {
    state,
    createChat,
    deleteChat,
    renameChat,
    setSearchQuery
  } = useChat();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    document.body.classList.toggle('app-body-scroll-lock', sidebarOpen);
    return () => {
      document.body.classList.remove('app-body-scroll-lock');
    };
  }, [sidebarOpen]);

  const filteredChats = useMemo(() => {
    const q = state.searchQuery.trim().toLowerCase();
    if (!q) {
      return state.chats;
    }
    return state.chats.filter(
      c =>
        c.title.toLowerCase().includes(q) ||
        (c.lastMessagePreview ?? '').toLowerCase().includes(q)
    );
  }, [state.chats, state.searchQuery]);

  const chatsForList = useMemo(
    () => filteredChats.map(entityToChat),
    [filteredChats]
  );

  const activeChatId = state.activeChatId ?? '';

  const handleNewChat = () => {
    createChat();
    setSidebarOpen(false);
  };

  const handleChatSelect = (id: string) => {
    navigate(`/chat/${id}`);
    setSidebarOpen(false);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      deleteChat(deletingId);
      setDeletingId(null);
    }
  };

  const editingChat = editingId
    ? state.chats.find(c => c.id === editingId)
    : null;

  return (
    <>
      <div className="app-shell">
        <div
          className={`app-sidebar-wrap${
            sidebarOpen ? ' app-sidebar-wrap--open' : ''
          }`}
        >
          <Sidebar
            chats={chatsForList}
            activeChatId={activeChatId}
            onChatSelect={handleChatSelect}
            onNewChat={handleNewChat}
            searchQuery={state.searchQuery}
            onSearchChange={setSearchQuery}
            onEditChat={handleEdit}
            onDeleteChat={id => setDeletingId(id)}
          />
        </div>

        {sidebarOpen && (
          <button
            type="button"
            className="app-sidebar-backdrop"
            aria-label="Закрыть меню"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="app-main">
          <div className="app-toolbar">
            <button
              type="button"
              className="app-menu-toggle"
              aria-label="Открыть меню чатов"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(true)}
            >
              <span className="app-menu-toggle-bars" aria-hidden>
                <span className="app-menu-toggle-bar" />
                <span className="app-menu-toggle-bar" />
                <span className="app-menu-toggle-bar" />
              </span>
            </button>
            <div className="app-toolbar-spacer" />
            <span className="app-toolbar-model">
              Модель: {settings.model}
            </span>
            <button
              type="button"
              className="app-toolbar-settings"
              onClick={() => setIsSettingsOpen(true)}
            >
              Параметры
            </button>
            <Toggle
              checked={isDark}
              onChange={onThemeChange}
              label="Тёмная тема"
            />
          </div>

          <div className="app-chat-area">
            <Outlet
              context={{
                openSettings: () => setIsSettingsOpen(true)
              }}
            />
          </div>
        </div>
      </div>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={onSaveSettings}
        initialSettings={settings}
      />

      {editingChat && (
        <EditChatModal
          title={editingChat.title}
          onClose={() => setEditingId(null)}
          onSave={title => {
            renameChat(editingChat.id, title);
            setEditingId(null);
          }}
        />
      )}

      {deletingId && (
        <ConfirmDialog
          title="Удалить чат?"
          message="История сообщений будет удалена без возможности восстановления."
          confirmLabel="Удалить"
          cancelLabel="Отмена"
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </>
  );
};
