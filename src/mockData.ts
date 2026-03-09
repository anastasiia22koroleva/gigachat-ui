import { Chat, Message, Settings } from './types';

export const mockChats: Chat[] = [
  {
    id: '1',
    title: 'Обсуждение проекта по React',
    lastMessageDate: new Date('2024-03-09T10:30:00'),
    isActive: true
  },
  {
    id: '2',
    title: 'Помощь с TypeScript',
    lastMessageDate: new Date('2024-03-09T09:15:00'),
    isActive: false
  },
  {
    id: '3',
    title: 'Вопросы по архитектуре приложения',
    lastMessageDate: new Date('2024-03-08T18:45:00'),
    isActive: false
  },
  {
    id: '4',
    title: 'Обсуждение дизайна UI компонентов',
    lastMessageDate: new Date('2024-03-08T14:20:00'),
    isActive: false
  },
  {
    id: '5',
    title: 'Планирование следующего спринта',
    lastMessageDate: new Date('2024-03-07T11:00:00'),
    isActive: false
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'Привет! Можешь рассказать о React?',
    timestamp: new Date('2024-03-09T10:30:00'),
    name: 'Вы'
  },
  {
    id: '2',
    role: 'assistant',
    content: '**React** — это библиотека для построения пользовательских интерфейсов. Вот основные особенности:\n\n- **Компонентный подход**\n- **Виртуальный DOM**\n- **Однонаправленный поток данных**\n\n```jsx\nfunction Component() {\n  return <div>Hello</div>;\n}\n```',
    timestamp: new Date('2024-03-09T10:31:00'),
    name: 'GigaChat'
  },
  {
    id: '3',
    role: 'user',
    content: 'А что такое хуки?',
    timestamp: new Date('2024-03-09T10:32:00'),
    name: 'Вы'
  },
  {
    id: '4',
    role: 'assistant',
    content: '**Хуки** (Hooks) — это функции, которые позволяют использовать состояние и другие возможности React в функциональных компонентах.\n\n*Основные хуки:*\n1. `useState`\n2. `useEffect` \n3. `useContext`\n\n*Дополнительные хуки:*\n- `useReducer`\n- `useCallback`\n- `useMemo`',
    timestamp: new Date('2024-03-09T10:33:00'),
    name: 'GigaChat'
  },
  {
    id: '5',
    role: 'user',
    content: 'Спасибо за объяснение!',
    timestamp: new Date('2024-03-09T10:34:00'),
    name: 'Вы'
  },
  {
    id: '6',
    role: 'assistant',
    content: 'Пожалуйста! Если у вас есть ещё вопросы, я готов на них ответить. 👋',
    timestamp: new Date('2024-03-09T10:35:00'),
    name: 'GigaChat'
  }
];

export const defaultSettings: Settings = {
  model: 'GigaChat',
  temperature: 0.7,
  topP: 0.9,
  maxTokens: 2048,
  systemPrompt: 'Вы полезный ассистент.',
  theme: 'light'
};