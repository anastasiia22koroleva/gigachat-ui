import type { Message } from '../types/message';
import { readGigaChatAuthFromStorage } from '../utils/gigachatAuthStorage';

const API_BASE =
  process.env.REACT_APP_GIGACHAT_API_BASE || '/gigachat-api';
const OAUTH_BASE =
  process.env.REACT_APP_GIGACHAT_OAUTH_BASE || '/gigachat-oauth';

/** Маппинг настроек UI на имена моделей API */
export function settingsModelToApiModel(
  model: string
): string {
  const map: Record<string, string> = {
    GigaChat: 'GigaChat',
    'GigaChat-Plus': 'GigaChat-Pro',
    'GigaChat-Pro': 'GigaChat-Pro',
    'GigaChat-Max': 'GigaChat-Max'
  };
  return map[model] ?? 'GigaChat';
}

export function buildApiMessages(
  systemPrompt: string,
  history: Message[]
): { role: string; content: string }[] {
  const messages: { role: string; content: string }[] = [
    { role: 'system', content: systemPrompt }
  ];
  for (const m of history) {
    messages.push({ role: m.role, content: m.content });
  }
  return messages;
}

function getCredentials(): string | null {
  const envB64 = process.env.REACT_APP_GIGACHAT_CREDENTIALS?.trim();
  if (envB64) {
    return envB64;
  }
  const envId = process.env.REACT_APP_GIGACHAT_CLIENT_ID?.trim();
  const envSecret = process.env.REACT_APP_GIGACHAT_CLIENT_SECRET?.trim();
  if (envId && envSecret) {
    return btoa(`${envId}:${envSecret}`);
  }
  const stored = readGigaChatAuthFromStorage();
  if (stored.b64) {
    return stored.b64;
  }
  if (stored.clientId && stored.clientSecret) {
    return btoa(`${stored.clientId}:${stored.clientSecret}`);
  }
  return null;
}

let tokenCache: { token: string; expiresAt: number } | null = null;

/** Сброс кэша токена после смены ключей */
export function clearGigaChatTokenCache(): void {
  tokenCache = null;
}

export async function getAccessToken(): Promise<string> {
  const creds = getCredentials();
  if (!creds) {
    throw new Error(
      'Не заданы учётные данные GigaChat. Откройте «Параметры» и введите ключ в разделе API, либо задайте REACT_APP_GIGACHAT_CREDENTIALS или CLIENT_ID/SECRET в .env и перезапустите npm start'
    );
  }
  if (tokenCache && Date.now() < tokenCache.expiresAt - 60_000) {
    return tokenCache.token;
  }
  const rqUid =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `rq-${Date.now()}`;
  const res = await fetch(`${OAUTH_BASE}/oauth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      RqUID: rqUid,
      Authorization: `Basic ${creds}`
    },
    body: 'scope=GIGACHAT_API_PERS'
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OAuth ${res.status}: ${text.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    access_token: string;
    expires_at: number;
  };
  const exp = data.expires_at;
  const expiresAtMs = exp < 1e12 ? exp * 1000 : exp;
  tokenCache = {
    token: data.access_token,
    expiresAt: expiresAtMs
  };
  return data.access_token;
}

export interface CompletionOptions {
  model: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  stream: boolean;
  signal?: AbortSignal;
}

/** Обычный REST-ответ целиком */
export async function chatCompletionRest(
  messages: { role: string; content: string }[],
  options: CompletionOptions
): Promise<string> {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      model: options.model,
      messages,
      temperature: options.temperature,
      top_p: options.topP,
      max_tokens: options.maxTokens,
      stream: false
    }),
    signal: options.signal
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Chat API ${res.status}: ${text.slice(0, 300)}`);
  }
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== 'string') {
    throw new Error('Пустой ответ от GigaChat');
  }
  return content;
}

/**
 * Streaming (SSE). Вызывает onDelta для каждого фрагмента текста.
 * При ошибке или завершении — reject/resolve.
 */
export async function chatCompletionStream(
  messages: { role: string; content: string }[],
  options: CompletionOptions,
  onDelta: (chunk: string) => void
): Promise<void> {
  const token = await getAccessToken();
  const res = await fetch(`${API_BASE}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      model: options.model,
      messages,
      temperature: options.temperature,
      top_p: options.topP,
      max_tokens: options.maxTokens,
      stream: true
    }),
    signal: options.signal
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Chat stream ${res.status}: ${text.slice(0, 300)}`);
  }
  const reader = res.body?.getReader();
  if (!reader) {
    throw new Error('Нет тела ответа для streaming');
  }
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) {
          continue;
        }
        const payload = trimmed.slice(5).trim();
        if (payload === '[DONE]') {
          return;
        }
        try {
          const json = JSON.parse(payload) as {
            choices?: Array<{ delta?: { content?: string } }>;
          };
          const piece = json.choices?.[0]?.delta?.content;
          if (typeof piece === 'string' && piece.length > 0) {
            onDelta(piece);
          }
        } catch {
          // неполная строка JSON — игнор
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
