import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef
} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  buildApiMessages,
  chatCompletionRest,
  chatCompletionStream,
  settingsModelToApiModel
} from '../../api/gigachat';
import { chatReducer } from '../../store/chatReducer';
import type { ChatAction, ChatState } from '../../types/chatState';
import type { Message } from '../../types/message';
import type { Settings } from '../../types';
import {
  loadChatStateFromStorage,
  mergeWithInitial,
  saveChatStateToStorage
} from '../../utils/storage';

function createId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function deriveChatTitle(content: string, dialogNumber: number): string {
  const t = content.trim();
  if (t.length < 2) {
    return `Диалог ${dialogNumber}`;
  }
  return t.length <= 40 ? t : `${t.slice(0, 37)}...`;
}

interface ChatContextValue {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  createChat: () => void;
  deleteChat: (id: string) => void;
  renameChat: (id: string, title: string) => void;
  setSearchQuery: (q: string) => void;
  sendMessage: (chatId: string, content: string) => Promise<void>;
  stopGeneration: () => void;
  setActiveChatId: (id: string | null) => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({
  children,
  settings
}: {
  children: React.ReactNode;
  settings: Settings;
}) {
  const [state, dispatch] = useReducer(
    chatReducer,
    mergeWithInitial(loadChatStateFromStorage())
  );
  const stateRef = useRef(state);
  stateRef.current = state;
  const navigate = useNavigate();
  const abortRef = useRef<AbortController | null>(null);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    saveChatStateToStorage(state);
  }, [state]);

  const setActiveChatId = useCallback((id: string | null) => {
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: id });
  }, []);

  const createChat = useCallback(() => {
    const id = createId();
    dispatch({
      type: 'CREATE_CHAT',
      payload: { id, title: 'Новый чат' }
    });
    navigate(`/chat/${id}`);
  }, [navigate]);

  const deleteChat = useCallback(
    (id: string) => {
      const wasActive = stateRef.current.activeChatId === id;
      const remaining = stateRef.current.chats.filter(c => c.id !== id);
      const sorted = [...remaining].sort(
        (a, b) =>
          new Date(b.lastMessageDate).getTime() -
          new Date(a.lastMessageDate).getTime()
      );
      const nextActive = sorted[0]?.id ?? null;
      dispatch({ type: 'DELETE_CHAT', payload: id });
      if (wasActive) {
        if (nextActive) {
          navigate(`/chat/${nextActive}`, { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    },
    [navigate]
  );

  const renameChat = useCallback((id: string, title: string) => {
    dispatch({ type: 'RENAME_CHAT', payload: { id, title } });
  }, []);

  const setSearchQuery = useCallback((q: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: q });
  }, []);

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    dispatch({ type: 'SET_SENDING', payload: false });
  }, []);

  const sendMessage = useCallback(
    async (chatId: string, content: string) => {
      const s = stateRef.current;
      const cfg = settingsRef.current;
      const prevMsgs = s.messagesByChatId[chatId] ?? [];
      const isFirstUser =
        prevMsgs.filter(m => m.role === 'user').length === 0;
      const chat = s.chats.find(c => c.id === chatId);
      if (!chat) {
        return;
      }

      const userMessage: Message = {
        id: createId(),
        role: 'user',
        content,
        timestamp: new Date(),
        name: 'Вы'
      };
      const now = new Date().toISOString();
      const preview = content.slice(0, 120);

      dispatch({ type: 'ADD_MESSAGE', payload: { chatId, message: userMessage } });

      if (isFirstUser) {
        const title = deriveChatTitle(
          content,
          chat.dialogNumber ?? s.dialogCounter
        );
        dispatch({
          type: 'UPDATE_CHAT_META',
          payload: {
            chatId,
            title,
            lastMessagePreview: preview,
            lastMessageDate: now
          }
        });
      } else {
        dispatch({
          type: 'UPDATE_CHAT_META',
          payload: {
            chatId,
            lastMessagePreview: preview,
            lastMessageDate: now
          }
        });
      }

      const history = [...prevMsgs, userMessage];
      const assistantId = createId();
      const assistantPlaceholder: Message = {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        name: 'GigaChat'
      };
      dispatch({
        type: 'ADD_MESSAGE',
        payload: { chatId, message: assistantPlaceholder }
      });
      dispatch({ type: 'SET_SENDING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      abortRef.current = new AbortController();
      const signal = abortRef.current.signal;

      const apiMessages = buildApiMessages(cfg.systemPrompt, history);
      const model = settingsModelToApiModel(cfg.model);
      const completionOpts = {
        model,
        temperature: cfg.temperature,
        topP: cfg.topP,
        maxTokens: cfg.maxTokens,
        stream: true as const,
        signal
      };

      try {
        let accumulated = '';
        await chatCompletionStream(apiMessages, completionOpts, chunk => {
          accumulated += chunk;
          dispatch({
            type: 'UPDATE_MESSAGE_CONTENT',
            payload: {
              chatId,
              messageId: assistantId,
              content: accumulated
            }
          });
        });
        if (!accumulated.trim()) {
          const text = await chatCompletionRest(apiMessages, {
            ...completionOpts,
            stream: false
          });
          dispatch({
            type: 'UPDATE_MESSAGE_CONTENT',
            payload: {
              chatId,
              messageId: assistantId,
              content: text
            }
          });
        }
      } catch (e) {
        const err = e as Error;
        if (err.name === 'AbortError') {
          /* частичный ответ остаётся в сообщении */
        } else {
          try {
            const text = await chatCompletionRest(apiMessages, {
              ...completionOpts,
              stream: false
            });
            dispatch({
              type: 'UPDATE_MESSAGE_CONTENT',
              payload: {
                chatId,
                messageId: assistantId,
                content: text
              }
            });
            dispatch({ type: 'SET_ERROR', payload: null });
          } catch (inner) {
            const msg = (inner as Error).message;
            dispatch({ type: 'SET_ERROR', payload: msg });
            dispatch({
              type: 'UPDATE_MESSAGE_CONTENT',
              payload: {
                chatId,
                messageId: assistantId,
                content: `Не удалось получить ответ: ${msg}`
              }
            });
          }
        }
      } finally {
        dispatch({ type: 'SET_SENDING', payload: false });
        abortRef.current = null;
      }
    },
    [dispatch]
  );

  const value: ChatContextValue = {
    state,
    dispatch,
    createChat,
    deleteChat,
    renameChat,
    setSearchQuery,
    sendMessage,
    stopGeneration,
    setActiveChatId
  };

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error('useChat должен вызываться внутри ChatProvider');
  }
  return ctx;
}

export function useChatOptional(): ChatContextValue | null {
  return useContext(ChatContext);
}
