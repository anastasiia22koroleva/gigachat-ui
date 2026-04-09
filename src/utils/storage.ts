import type { ChatState } from '../types/chatState';
import { initialChatState } from '../types/chatState';
import type { Message } from '../types/message';

const STORAGE_KEY = 'gigachat-ui-chat-state-v1';

type SerializedMessage = Omit<Message, 'timestamp'> & { timestamp: string };

interface PersistedShape {
  chats: ChatState['chats'];
  messagesByChatId: Record<string, SerializedMessage[]>;
  activeChatId: string | null;
  dialogCounter: number;
}

/** Загрузка состояния из localStorage; при битых данных — null */
export function loadChatStateFromStorage(): Partial<ChatState> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const data = JSON.parse(raw) as PersistedShape;
    const messagesByChatId: Record<string, Message[]> = {};
    for (const [chatId, msgs] of Object.entries(data.messagesByChatId || {})) {
      messagesByChatId[chatId] = msgs.map(m => ({
        ...m,
        timestamp: new Date(m.timestamp)
      }));
    }
    return {
      chats: Array.isArray(data.chats) ? data.chats : [],
      messagesByChatId,
      activeChatId: data.activeChatId ?? null,
      dialogCounter: typeof data.dialogCounter === 'number' ? data.dialogCounter : 0
    };
  } catch {
    return null;
  }
}

/** Сохранение чатов и сообщений (без UI-полей вроде searchQuery) */
export function saveChatStateToStorage(state: ChatState): void {
  try {
    const messagesByChatId: Record<string, SerializedMessage[]> = {};
    for (const [chatId, msgs] of Object.entries(state.messagesByChatId)) {
      messagesByChatId[chatId] = msgs.map(m => ({
        ...m,
        timestamp:
          m.timestamp instanceof Date
            ? m.timestamp.toISOString()
            : String(m.timestamp)
      }));
    }
    const payload: PersistedShape = {
      chats: state.chats,
      messagesByChatId,
      activeChatId: state.activeChatId,
      dialogCounter: state.dialogCounter
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // квота или приватный режим
  }
}

export function mergeWithInitial(partial: Partial<ChatState> | null): ChatState {
  if (!partial) {
    return { ...initialChatState };
  }
  return {
    ...initialChatState,
    ...partial,
    isSending: false,
    error: null,
    searchQuery: '',
    chats: partial.chats ?? [],
    messagesByChatId: partial.messagesByChatId ?? {},
    activeChatId: partial.activeChatId ?? null,
    dialogCounter: partial.dialogCounter ?? 0
  };
}
