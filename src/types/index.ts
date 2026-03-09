export interface Chat {
  id: string;
  title: string;
  lastMessageDate: Date;
  isActive?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  name?: string;
}

export interface Settings {
  model: 'GigaChat' | 'GigaChat-Plus' | 'GigaChat-Pro' | 'GigaChat-Max';
  temperature: number;
  topP: number;
  maxTokens: number;
  systemPrompt: string;
  theme: 'light' | 'dark';
}