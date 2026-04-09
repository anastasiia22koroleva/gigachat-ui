import {
  loadChatStateFromStorage,
  saveChatStateToStorage,
  mergeWithInitial
} from './storage';
import { initialChatState } from '../types/chatState';
import type { ChatState } from '../types/chatState';

const STORAGE_KEY = 'gigachat-ui-chat-state-v1';

function createMemoryStorage() {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => (key in store ? store[key] : null)),
    setItem: jest.fn((key: string, val: string) => {
      store[key] = val;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: () => {
      store = {};
    },
    snapshot: () => ({ ...store })
  };
}

describe('storage (localStorage)', () => {
  let mem: ReturnType<typeof createMemoryStorage>;

  beforeEach(() => {
    mem = createMemoryStorage();
    Object.defineProperty(window, 'localStorage', {
      value: mem,
      writable: true
    });
  });

  it('saveChatStateToStorage записывает JSON в localStorage', () => {
    const state: ChatState = {
      ...initialChatState,
      chats: [
        {
          id: '1',
          title: 'T',
          lastMessageDate: new Date().toISOString()
        }
      ],
      activeChatId: '1',
      dialogCounter: 1
    };
    saveChatStateToStorage(state);
    expect(mem.setItem).toHaveBeenCalled();
    const raw = mem.snapshot()[STORAGE_KEY];
    expect(raw).toBeTruthy();
    const parsed = JSON.parse(raw);
    expect(parsed.chats).toHaveLength(1);
    expect(parsed.activeChatId).toBe('1');
  });

  it('loadChatStateFromStorage восстанавливает данные', () => {
    const payload = {
      chats: [
        {
          id: 'x',
          title: 'Chat',
          lastMessageDate: '2024-01-01T00:00:00.000Z'
        }
      ],
      messagesByChatId: {
        x: [
          {
            id: 'm',
            role: 'user',
            content: 'hi',
            timestamp: '2024-01-01T01:00:00.000Z'
          }
        ]
      },
      activeChatId: 'x',
      dialogCounter: 2
    };
    mem.setItem(STORAGE_KEY, JSON.stringify(payload));
    const loaded = loadChatStateFromStorage();
    expect(loaded?.chats).toHaveLength(1);
    expect(loaded?.activeChatId).toBe('x');
    expect(loaded?.messagesByChatId?.x?.[0]?.content).toBe('hi');
    expect(loaded?.messagesByChatId?.x?.[0]?.timestamp).toBeInstanceOf(Date);
  });

  it('при битом JSON loadChatStateFromStorage возвращает null, merge не падает', () => {
    mem.setItem(STORAGE_KEY, '{not json');
    expect(loadChatStateFromStorage()).toBeNull();
    const merged = mergeWithInitial(loadChatStateFromStorage());
    expect(merged.chats).toEqual([]);
  });
});
