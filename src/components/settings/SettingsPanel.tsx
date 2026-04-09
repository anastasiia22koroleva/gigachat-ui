import React, { useEffect, useState } from 'react';
import { Button } from '../ui/Button';
import { Slider } from '../ui/Slider';
import { Toggle } from '../ui/Toggle';
import { Settings } from '../../types';
import { defaultSettings } from '../../mockData';
import { clearGigaChatTokenCache } from '../../api/gigachat';
import {
  readGigaChatAuthFromStorage,
  writeGigaChatAuthToStorage
} from '../../utils/gigachatAuthStorage';
import './SettingsPanel.css';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: Settings) => void;
  initialSettings?: Settings;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSettings = defaultSettings
}) => {
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [authB64, setAuthB64] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const a = readGigaChatAuthFromStorage();
    setAuthB64(a.b64);
    setClientId(a.clientId);
    setClientSecret(a.clientSecret);
  }, [isOpen]);

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  const handleSave = () => {
    writeGigaChatAuthToStorage({
      b64: authB64.trim(),
      clientId: clientId.trim(),
      clientSecret: clientSecret.trim()
    });
    clearGigaChatTokenCache();
    onSave(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="settings-overlay" onClick={onClose} />
      <div className="settings-drawer">
        <div className="settings-header">
          <h2 className="settings-title">Настройки</h2>
          <button className="settings-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="settings-content">
          <div className="settings-section settings-section--api">
            <label className="settings-label">GigaChat: ключ API</label>
            <p className="settings-hint">
              Вставьте <strong>ключ авторизации (Base64)</strong> из{' '}
              <a
                href="https://developers.sber.ru/docs/ru/gigachat/quickstart/ind-using-api"
                target="_blank"
                rel="noopener noreferrer"
                className="settings-link"
              >
                инструкции GigaChat
              </a>
              . Сохраняется только в этом браузере (localStorage). Альтернатива
              — переменные в файле <code className="settings-code">.env</code> и
              перезапуск <code className="settings-code">npm start</code>.
            </p>
            <input
              type="password"
              className="settings-input"
              autoComplete="off"
              value={authB64}
              onChange={e => setAuthB64(e.target.value)}
              placeholder="Ключ авторизации (Base64)…"
              aria-label="Ключ авторизации GigaChat Base64"
            />
            <p className="settings-hint settings-hint--secondary">
              Или пара Client ID + Secret (если не используете один Base64-ключ):
            </p>
            <input
              type="password"
              className="settings-input settings-input--stack"
              autoComplete="off"
              value={clientId}
              onChange={e => setClientId(e.target.value)}
              placeholder="Client ID"
              aria-label="GigaChat Client ID"
            />
            <input
              type="password"
              className="settings-input settings-input--stack"
              autoComplete="off"
              value={clientSecret}
              onChange={e => setClientSecret(e.target.value)}
              placeholder="Client Secret"
              aria-label="GigaChat Client Secret"
            />
          </div>

          <div className="settings-section">
            <label className="settings-label">Модель</label>
            <select
              className="settings-select"
              value={settings.model}
              onChange={(e) => setSettings({
                ...settings,
                model: e.target.value as Settings['model']
              })}
            >
              <option value="GigaChat">GigaChat</option>
              <option value="GigaChat-Plus">GigaChat-Plus</option>
              <option value="GigaChat-Pro">GigaChat-Pro</option>
              <option value="GigaChat-Max">GigaChat-Max</option>
            </select>
          </div>

          <div className="settings-section">
            <Slider
              min={0}
              max={2}
              step={0.1}
              value={settings.temperature}
              onChange={(value) => setSettings({ ...settings, temperature: value })}
              label="Temperature"
            />
            <p className="settings-hint">
              Контролирует креативность ответов. Меньше — точнее, больше — разнообразнее.
            </p>
          </div>

          <div className="settings-section">
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={settings.topP}
              onChange={(value) => setSettings({ ...settings, topP: value })}
              label="Top-P"
            />
          </div>

          <div className="settings-section">
            <label className="settings-label">Max Tokens</label>
            <input
              type="number"
              className="settings-input"
              min={1}
              max={4096}
              value={settings.maxTokens}
              onChange={(e) => setSettings({
                ...settings,
                maxTokens: parseInt(e.target.value) || 2048
              })}
            />
          </div>

          <div className="settings-section">
            <label className="settings-label">System Prompt</label>
            <textarea
              className="settings-textarea"
              rows={4}
              value={settings.systemPrompt}
              onChange={(e) => setSettings({
                ...settings,
                systemPrompt: e.target.value
              })}
              placeholder="Введите системный промпт..."
            />
          </div>

          <div className="settings-section">
            <Toggle
              checked={settings.theme === 'dark'}
              onChange={(checked) => setSettings({
                ...settings,
                theme: checked ? 'dark' : 'light'
              })}
              label="Тёмная тема"
            />
          </div>
        </div>

        <div className="settings-footer">
          <Button variant="secondary" onClick={handleReset}>
            Сбросить
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Сохранить
          </Button>
        </div>
      </div>
    </>
  );
};