import { chatReducer } from './chatReducer';
import { initialChatState } from '../types/chatState';
import type { Message } from '../types/message';

const baseMessage = (over: Partial<Message> = {}): Message => ({
  id: 'm1',
  role: 'user',
  content: 'hi',
  timestamp: new Date('2024-01-01T12:00:00'),
  ...over
});

describe('chatReducer', () => {
  it('ADD_MESSAGE добавляет сообщение в конец массива для чата', () => {
    const chatId = 'c1';
    const state = {
      ...initialChatState,
      messagesByChatId: { [chatId]: [baseMessage({ id: 'a' })] }
    };
    const next = baseMessage({ id: 'b', content: 'second' });
    const out = chatReducer(state, {
      type: 'ADD_MESSAGE',
      payload: { chatId, message: next }
    });
    expect(out.messagesByChatId[chatId]).toHaveLength(2);
    expect(out.messagesByChatId[chatId]?.[1]?.id).toBe('b');
    expect(out.messagesByChatId[chatId]?.[1]?.content).toBe('second');
  });

  it('CREATE_CHAT создаёт чат с переданным id и добавляет в chats', () => {
    const out = chatReducer(initialChatState, {
      type: 'CREATE_CHAT',
      payload: { id: 'new-id', title: 'Новый чат' }
    });
    expect(out.chats.some(c => c.id === 'new-id')).toBe(true);
    expect(out.activeChatId).toBe('new-id');
    expect(out.dialogCounter).toBe(1);
    expect(out.messagesByChatId['new-id']).toEqual([]);
  });

  it('DELETE_CHAT удаляет чат и сбрасывает activeChatId при удалении активного', () => {
    const s0 = chatReducer(initialChatState, {
      type: 'CREATE_CHAT',
      payload: { id: 'a', title: 'A' }
    });
    const s1 = chatReducer(s0, {
      type: 'CREATE_CHAT',
      payload: { id: 'b', title: 'B' }
    });
    expect(s1.activeChatId).toBe('b');
    const out = chatReducer(s1, { type: 'DELETE_CHAT', payload: 'b' });
    expect(out.chats.every(c => c.id !== 'b')).toBe(true);
    expect(out.activeChatId).toBe('a');
  });

  it('DELETE_CHAT при удалении единственного чата даёт activeChatId null', () => {
    const s = chatReducer(initialChatState, {
      type: 'CREATE_CHAT',
      payload: { id: 'only', title: 'X' }
    });
    const out = chatReducer(s, { type: 'DELETE_CHAT', payload: 'only' });
    expect(out.chats).toHaveLength(0);
    expect(out.activeChatId).toBeNull();
  });

  it('RENAME_CHAT обновляет название по id', () => {
    const s = chatReducer(initialChatState, {
      type: 'CREATE_CHAT',
      payload: { id: 'x', title: 'Old' }
    });
    const out = chatReducer(s, {
      type: 'RENAME_CHAT',
      payload: { id: 'x', title: '  New title  ' }
    });
    expect(out.chats.find(c => c.id === 'x')?.title).toBe('New title');
  });
});
