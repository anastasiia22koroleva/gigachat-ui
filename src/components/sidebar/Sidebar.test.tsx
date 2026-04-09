import React, { useMemo, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from './Sidebar';
import type { Chat } from '../../types';

const makeChat = (id: string, title: string, preview = ''): Chat => ({
  id,
  title,
  lastMessageDate: new Date('2024-01-02T12:00:00'),
  lastMessagePreview: preview
});

function SidebarSearchHarness({ allChats }: { allChats: Chat[] }) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) {
      return allChats;
    }
    return allChats.filter(
      c =>
        c.title.toLowerCase().includes(qq) ||
        (c.lastMessagePreview ?? '').toLowerCase().includes(qq)
    );
  }, [allChats, q]);

  return (
    <Sidebar
      chats={filtered}
      activeChatId=""
      onChatSelect={jest.fn()}
      onNewChat={jest.fn()}
      searchQuery={q}
      onSearchChange={setQ}
      onEditChat={jest.fn()}
      onDeleteChat={jest.fn()}
    />
  );
}

function SidebarDeleteHarness({ allChats }: { allChats: Chat[] }) {
  const [pending, setPending] = useState<string | null>(null);
  return (
    <>
      <Sidebar
        chats={allChats}
        activeChatId=""
        onChatSelect={jest.fn()}
        onNewChat={jest.fn()}
        searchQuery=""
        onSearchChange={jest.fn()}
        onEditChat={jest.fn()}
        onDeleteChat={id => setPending(id)}
      />
      {pending !== null && (
        <div role="dialog" aria-labelledby="confirm-del-title">
          <h2 id="confirm-del-title">Удалить чат?</h2>
        </div>
      )}
    </>
  );
}

describe('Sidebar', () => {
  const all = [
    makeChat('1', 'Обсуждение React', 'hooks'),
    makeChat('2', 'TypeScript основы', 'types'),
    makeChat('3', 'Кулинария', 'рецепт')
  ];

  it('при пустом поиске отображаются все чаты', () => {
    render(<SidebarSearchHarness allChats={all} />);
    expect(screen.getByText('Обсуждение React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript основы')).toBeInTheDocument();
    expect(screen.getByText('Кулинария')).toBeInTheDocument();
  });

  it('поиск фильтрует список по названию', async () => {
    render(<SidebarSearchHarness allChats={all} />);
    const input = screen.getByRole('textbox', { name: /поиск чатов/i });
    await userEvent.type(input, 'React');
    expect(screen.getByText('Обсуждение React')).toBeInTheDocument();
    expect(screen.queryByText('TypeScript основы')).not.toBeInTheDocument();
    expect(screen.queryByText('Кулинария')).not.toBeInTheDocument();
  });

  it('поиск учитывает lastMessagePreview', async () => {
    render(<SidebarSearchHarness allChats={all} />);
    const input = screen.getByRole('textbox', { name: /поиск чатов/i });
    await userEvent.type(input, 'рецепт');
    expect(screen.getByText('Кулинария')).toBeInTheDocument();
    expect(screen.queryByText('Обсуждение React')).not.toBeInTheDocument();
  });

  it('после нажатия «Уд.» появляется диалог подтверждения (обёртка)', async () => {
    render(<SidebarDeleteHarness allChats={[makeChat('a', 'Один чат')]} />);
    const item = screen.getByText('Один чат').closest('.chat-item');
    expect(item).toBeTruthy();
    await userEvent.hover(item!);
    const del = await screen.findByRole('button', { name: /удалить чат/i });
    await userEvent.click(del);
    expect(
      screen.getByRole('dialog', { name: /удалить чат/i })
    ).toBeInTheDocument();
  });
});
