export type { Message, MessageRole } from './message';
export type { ChatState, ChatAction, ChatEntity } from './chatState';

export interface Chat {
  id: string;
  title: string;
  lastMessageDate: Date;
  lastMessagePreview?: string;
  isActive?: boolean;
}

export interface Settings {
  model: 'GigaChat' | 'GigaChat-Plus' | 'GigaChat-Pro' | 'GigaChat-Max';
  temperature: number;
  topP: number;
  maxTokens: number;
  systemPrompt: string;
  theme: 'light' | 'dark';
}