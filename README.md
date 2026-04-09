# GigaChat UI

Интерфейс для общения с GigaChat. Учебный проект по React выполнен Королевой А.Е. (100691).


## Технологии

- React 18
- TypeScript
- CSS Modules
- React Markdown

## Установка и запуск

1. Клонируйте репозиторий:
```bash
git clone https://github.com/ВАШ-ЛОГИН/gigachat-ui.git
cd gigachat-ui
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите проект:
```bash
npm start
```


4. Откройте: http://localhost:3000

## Тестирование

Тесты запускаются через Jest и React Testing Library (входит в Create React App). Однократный прогон без интерактивного режима:

```bash
CI=true npm test -- --watchAll=false
```

В обычном режиме разработки достаточно `npm test` (перезапуск при изменениях).

**Что покрыто тестами (рядом с кодом, `*.test.ts` / `*.test.tsx`):**

- `src/store/chatReducer.test.ts` — редьюсер чата: добавление сообщения, создание/удаление/переименование чата, сброс активного чата при удалении.
- `src/components/chat/InputArea.test.tsx` — отправка по кнопке и по Enter, блокировка кнопки при пустом вводе.
- `src/components/chat/Message.test.tsx` — отображение для ролей user/assistant, кнопка «Копировать» только у ассистента (markdown и подсветка кода замокированы).
- `src/components/sidebar/Sidebar.test.tsx` — фильтрация списка по поиску, пустой запрос показывает все чаты, сценарий удаления с появлением подтверждения (через тестовую обёртку).
- `src/utils/storage.test.ts` — сохранение/загрузка состояния из `localStorage` и устойчивость к невалидному JSON (мок хранилища).

Запросы к GigaChat API в тестах не выполняются.

## Структура проекта

```bash
src/
├── components/
│   ├── auth/
│   │   └── AuthForm.tsx          # Форма авторизации
│   ├── chat/
│   │   ├── ChatWindow.tsx        # Окно чата
│   │   ├── Message.tsx           # Сообщение с markdown
│   │   ├── TypingIndicator.tsx   # Индикатор печати
│   │   └── InputArea.tsx         # Поле ввода
│   ├── sidebar/
│   │   ├── Sidebar.tsx           # Боковая панель
│   │   ├── ChatItem.tsx          # Элемент списка чатов
│   │   └── SearchInput.tsx       # Поиск
│   └── ui/
│       ├── Button.tsx            # Кнопка
│       ├── Toggle.tsx            # Переключатель
│       └── Slider.tsx            # Слайдер
├── styles/
│   └── theme.css                 # CSS-переменные
├── types/
│   └── index.ts                  # TypeScript интерфейсы
├── App.tsx                       # Корневой компонент
└── index.tsx                     # Точка входа