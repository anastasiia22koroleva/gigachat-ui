import type { ChatState, ChatAction } from '../types/chatState';

function sortChatsByDate(chats: ChatState['chats']): ChatState['chats'] {
  return [...chats].sort(
    (a, b) =>
      new Date(b.lastMessageDate).getTime() -
      new Date(a.lastMessageDate).getTime()
  );
}

export function chatReducer(
  state: ChatState,
  action: ChatAction
): ChatState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...action.payload, isSending: false, error: null, searchQuery: '' };

    case 'SET_ACTIVE_CHAT':
      return { ...state, activeChatId: action.payload };

    case 'CREATE_CHAT': {
      const { id, title, lastMessagePreview = '' } = action.payload;
      const now = new Date().toISOString();
      const dialogNumber = state.dialogCounter + 1;
      const entity = {
        id,
        title,
        lastMessageDate: now,
        lastMessagePreview,
        dialogNumber
      };
      return {
        ...state,
        dialogCounter: dialogNumber,
        chats: sortChatsByDate([entity, ...state.chats]),
        messagesByChatId: {
          ...state.messagesByChatId,
          [id]: state.messagesByChatId[id] ?? []
        },
        activeChatId: id,
        error: null
      };
    }

    case 'DELETE_CHAT': {
      const id = action.payload;
      const { [id]: _removed, ...restMessages } = state.messagesByChatId;
      const chats = state.chats.filter(c => c.id !== id);
      const sorted = sortChatsByDate(chats);
      let activeChatId = state.activeChatId;
      if (activeChatId === id) {
        activeChatId = sorted[0]?.id ?? null;
      }
      return {
        ...state,
        chats: sorted,
        messagesByChatId: restMessages,
        activeChatId
      };
    }

    case 'RENAME_CHAT': {
      const { id, title } = action.payload;
      return {
        ...state,
        chats: state.chats.map(c =>
          c.id === id ? { ...c, title: title.trim() || c.title } : c
        )
      };
    }

    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };

    case 'ADD_MESSAGE': {
      const { chatId, message } = action.payload;
      const prev = state.messagesByChatId[chatId] ?? [];
      return {
        ...state,
        messagesByChatId: {
          ...state.messagesByChatId,
          [chatId]: [...prev, message]
        }
      };
    }

    case 'UPDATE_MESSAGE_CONTENT': {
      const { chatId, messageId, content } = action.payload;
      const list = state.messagesByChatId[chatId] ?? [];
      return {
        ...state,
        messagesByChatId: {
          ...state.messagesByChatId,
          [chatId]: list.map(m =>
            m.id === messageId ? { ...m, content } : m
          )
        }
      };
    }

    case 'SET_SENDING':
      return { ...state, isSending: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'UPDATE_CHAT_META': {
      const { chatId, title, lastMessagePreview, lastMessageDate } =
        action.payload;
      return {
        ...state,
        chats: sortChatsByDate(
          state.chats.map(c =>
            c.id === chatId
              ? {
                  ...c,
                  ...(title !== undefined ? { title } : {}),
                  lastMessagePreview,
                  lastMessageDate
                }
              : c
          )
        )
      };
    }

    default:
      return state;
  }
}
