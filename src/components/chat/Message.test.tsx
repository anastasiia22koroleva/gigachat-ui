import React from 'react';
import { render, screen } from '@testing-library/react';
import { Message } from './Message';
import type { Message as MessageType } from '../../types';

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
}));

jest.mock('remark-gfm', () => ({
  __esModule: true,
  default: () => {}
}));

jest.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }: { children: React.ReactNode }) => (
    <pre data-testid="syntax-block">{children}</pre>
  )
}));

jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  oneDark: {}
}));

const sample: MessageType = {
  id: '1',
  role: 'user',
  content: 'Текст пользователя',
  timestamp: new Date('2024-06-01T10:00:00')
};

describe('Message', () => {
  it('variant user: текст и класс user', () => {
    const { container } = render(
      <Message message={sample} onCopy={jest.fn()} variant="user" />
    );
    expect(screen.getByText('Текст пользователя')).toBeInTheDocument();
    expect(container.querySelector('.message.user')).toBeInTheDocument();
  });

  it('variant assistant: текст, класс assistant и кнопка «Копировать»', () => {
    const assistant: MessageType = {
      ...sample,
      role: 'assistant',
      content: 'Ответ бота'
    };
    const { container } = render(
      <Message message={assistant} onCopy={jest.fn()} variant="assistant" />
    );
    expect(screen.getByText('Ответ бота')).toBeInTheDocument();
    expect(container.querySelector('.message.assistant')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /копировать сообщение/i })
    ).toBeInTheDocument();
  });

  it('для variant user кнопки «Копировать» нет', () => {
    render(<Message message={sample} onCopy={jest.fn()} variant="user" />);
    expect(
      screen.queryByRole('button', { name: /копировать/i })
    ).not.toBeInTheDocument();
  });
});
