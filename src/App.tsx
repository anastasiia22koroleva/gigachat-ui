import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { AuthForm } from './components/auth/AuthForm';
import { ChatWindow } from './components/chat/ChatWindow';
import { MainLayout } from './app/layout/MainLayout';
import { ChatProvider } from './app/providers/ChatProvider';
import { HomeRoute } from './app/router/HomeRoute';
import { defaultSettings } from './mockData';
import { Settings } from './types';
import './styles/theme.css';
import './styles/AppLayout.css';

function AppShell() {
  const [isDark, setIsDark] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  const handleThemeChange = (checked: boolean) => {
    setIsDark(checked);
    setSettings({ ...settings, theme: checked ? 'dark' : 'light' });
  };

  const handleSaveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    setIsDark(newSettings.theme === 'dark');
  };

  return (
    <ChatProvider settings={settings}>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout
              isDark={isDark}
              onThemeChange={handleThemeChange}
              settings={settings}
              onSaveSettings={handleSaveSettings}
            />
          }
        >
          <Route index element={<HomeRoute />} />
          <Route path="chat/:chatId" element={<ChatWindow />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ChatProvider>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (credentials: string, scope: string) => {
    console.log('Login:', { credentials, scope });
    setIsAuthenticated(true);
    navigate('/', { replace: true });
  };

  if (!isAuthenticated) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return <AppShell />;
}

export default App;
