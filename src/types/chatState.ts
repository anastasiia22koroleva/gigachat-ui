import { Message } from './message';

/** Сущность чата в списке (сообщения хранятся отдельно по id) */
export interface ChatEntity {
  id: string;
  title: string;
  lastMessageDate: string;
  /** Превью последнего сообщения для поиска */
  lastMessagePreview?: string;
  /** Номер для автозаголовка «Диалог N» */
  dialogNumber?: number;
}

/** Глобальное состояние чатов (редьюсер) */
export interface ChatState {
  chats: ChatEntity[];
  messagesByChatId: Record<string, Message[]>;
  activeChatId: string | null;
  isSending: boolean;
  error: string | null;
  searchQuery: string;
  /** Счётчик для имён «Диалог N» */
  dialogCounter: number;
}

/** Действия редьюсера */
export type ChatAction =
  | { type: 'HYDRATE'; payload: Omit<ChatState, 'isSending' | 'error' | 'searchQuery'> }
  | { type: 'SET_ACTIVE_CHAT'; payload: string | null }
  | {
      type: 'CREATE_CHAT';
      payload: { id: string; title: string; lastMessagePreview?: string };
    }
  | { type: 'DELETE_CHAT'; payload: string }
  | { type: 'RENAME_CHAT'; payload: { id: string; title: string } }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: { chatId: string; message: Message } }
  | {
      type: 'UPDATE_MESSAGE_CONTENT';
      payload: { chatId: string; messageId: string; content: string };
    }
  | { type: 'SET_SENDING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | {
      type: 'UPDATE_CHAT_META';
      payload: {
        chatId: string;
        title?: string;
        lastMessagePreview: string;
        lastMessageDate: string;
      };
    }
export const initialChatState: ChatState = {
  chats: [],
  messagesByChatId: {},
  activeChatId: null,
  isSending: false,
  error: null,
  searchQuery: '',
  dialogCounter: 0
};
