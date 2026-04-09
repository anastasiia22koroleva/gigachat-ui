/**
 * Конфигурация маршрутов приложения (см. задание).
 * Сами маршруты объявлены в App.tsx через <Routes>.
 */
export const ROUTES = {
  home: '/',
  chat: (id: string) => `/chat/${id}`
} as const;
