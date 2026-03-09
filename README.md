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

## Структура проекта

## 📁 Структура проекта

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