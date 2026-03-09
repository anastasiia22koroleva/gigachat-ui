import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { ErrorMessage } from '../ui/ErrorMessage';
import './AuthForm.css';

interface AuthFormProps {
  onLogin: (credentials: string, scope: string) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [credentials, setCredentials] = useState('');
  const [scope, setScope] = useState<'GIGACHAT_API_PERS' | 'GIGACHAT_API_B2B' | 'GIGACHAT_API_CORP'>(
    'GIGACHAT_API_PERS'
  );
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!credentials.trim()) {
      setError('Поле Credentials не может быть пустым');
      return;
    }

    setError('');
    onLogin(credentials, scope);
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h1 className="auth-title">GigaChat</h1>
        <p className="auth-subtitle">Войдите в систему, чтобы продолжить</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="credentials" className="auth-label">
              Credentials (Base64)
            </label>
            <input
              type="password"
              id="credentials"
              className="auth-input"
              value={credentials}
              onChange={(e) => setCredentials(e.target.value)}
              placeholder="Введите Base64 строку"
            />
            {error && <ErrorMessage message={error} variant="inline" />}
          </div>

          <div className="auth-field">
            <label className="auth-label">Scope</label>
            <div className="auth-radio-group">
              <label className="auth-radio">
                <input
                  type="radio"
                  name="scope"
                  value="GIGACHAT_API_PERS"
                  checked={scope === 'GIGACHAT_API_PERS'}
                  onChange={(e) => setScope(e.target.value as any)}
                />
                <span>GIGACHAT_API_PERS</span>
              </label>

              <label className="auth-radio">
                <input
                  type="radio"
                  name="scope"
                  value="GIGACHAT_API_B2B"
                  checked={scope === 'GIGACHAT_API_B2B'}
                  onChange={(e) => setScope(e.target.value as any)}
                />
                <span>GIGACHAT_API_B2B</span>
              </label>

              <label className="auth-radio">
                <input
                  type="radio"
                  name="scope"
                  value="GIGACHAT_API_CORP"
                  checked={scope === 'GIGACHAT_API_CORP'}
                  onChange={(e) => setScope(e.target.value as any)}
                />
                <span>GIGACHAT_API_CORP</span>
              </label>
            </div>
          </div>

          <Button type="submit" variant="primary" size="large" fullWidth>
            Войти
          </Button>
        </form>
      </div>
    </div>
  );
};