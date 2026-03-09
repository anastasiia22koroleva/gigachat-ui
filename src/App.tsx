import React, { useState } from 'react';
import { AuthForm } from './components/auth/AuthForm';
import { Sidebar } from './components/sidebar/Sidebar';
import { ChatWindow } from './components/chat/ChatWindow';
import { SettingsPanel } from './components/settings';
import { Toggle } from './components/ui';
import { mockChats, mockMessages, defaultSettings } from './mockData';
import { Settings } from './types';
import './styles/theme.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [activeChatId, setActiveChatId] = useState('1');
  const [chats, setChats] = useState(mockChats);
  const [messages, setMessages] = useState(mockMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const handleLogin = (credentials: string, scope: string) => {
    console.log('Login:', { credentials, scope });
    setIsAuthenticated(true);
  };

  const handleThemeChange = (checked: boolean) => {
    setIsDark(checked);
    document.documentElement.setAttribute('data-theme', checked ? 'dark' : 'light');
    setSettings({ ...settings, theme: checked ? 'dark' : 'light' });
  };

  const handleNewChat = () => {
    const newChat = {
      id: String(chats.length + 1),
      title: 'Новый чат',
      lastMessageDate: new Date(),
      isActive: true
    };
    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
    setMessages([]);
  };

  const handleSearch = (query: string) => {
    console.log('Search:', query);
  };

  const handleEditChat = (id: string) => {
    console.log('Edit chat:', id);
  };

  const handleDeleteChat = (id: string) => {
    setChats(chats.filter(chat => chat.id !== id));
    if (activeChatId === id && chats.length > 0) {
      setActiveChatId(chats[0].id);
    }
  };

  const handleSendMessage = (content: string) => {
    console.log('Send message:', content);
    
    const userMessage = {
      id: String(messages.length + 1),
      role: 'user' as const,
      content: content,
      timestamp: new Date(),
      name: 'Вы'
    };
    
    setMessages([...messages, userMessage]);
    
    setIsTyping(true);
    setTimeout(() => {
      const assistantMessage = {
        id: String(messages.length + 2),
        role: 'assistant' as const,
        content: '**Ответ от GigaChat:**\n\nЯ получил ваше сообщение. Это тестовый ответ с **markdown** разметкой.\n\n* Список\n* Примеров\n* Форматирования',
        timestamp: new Date(),
        name: 'GigaChat'
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleStopGeneration = () => {
    setIsTyping(false);
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleSaveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    document.documentElement.setAttribute('data-theme', newSettings.theme);
    setIsDark(newSettings.theme === 'dark');
    console.log('Settings saved:', newSettings);
  };

  const handleCopyMessage = (id: string) => {
    console.log('Copy message:', id);
  };

  if (!isAuthenticated) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <>
      <div style={{ 
        display: 'flex', 
        height: '100vh',
        overflow: 'hidden' /* Предотвращаем скролл всей страницы */
      }}>
        {/* Sidebar - фиксированная позиция */}
        <div style={{ 
          width: '280px', 
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 10
        }}>
          <Sidebar
            chats={chats}
            activeChatId={activeChatId}
            onChatSelect={setActiveChatId}
            onNewChat={handleNewChat}
            onSearch={handleSearch}
            onEditChat={handleEditChat}
            onDeleteChat={handleDeleteChat}
          />
        </div>

        {/* Main Content - с отступом для боковой панели */}
        <div style={{ 
          flex: 1,
          marginLeft: '280px', /* Отступ равен ширине sidebar */
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '12px 20px', 
            borderBottom: '1px solid var(--color-border)', 
            display: 'flex', 
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '16px',
            backgroundColor: 'var(--color-bg-primary)',
            zIndex: 5
          }}>
            <span style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
              Модель: {settings.model}
            </span>
            <Toggle
              checked={isDark}
              onChange={handleThemeChange}
              label="Тёмная тема"
            />
          </div>
          
          <div style={{ 
            flex: 1,
            overflow: 'hidden' /* ChatWindow сам управляет своим скроллом */
          }}>
            <ChatWindow
              chatTitle={chats.find(c => c.id === activeChatId)?.title || 'Чат'}
              messages={messages}
              isTyping={isTyping}
              onSendMessage={handleSendMessage}
              onStopGeneration={handleStopGeneration}
              onOpenSettings={handleOpenSettings}
              onCopyMessage={handleCopyMessage}
            />
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
        initialSettings={settings}
      />
    </>
  );
}

export default App;