export type NavItemId =
  | 'dashboard'
  | 'library'
  | 'flashcards'
  | 'learn'
  | 'test'
  | 'match'
  | 'statistics'
  | 'settings';

export type NavItem = {
  id: NavItemId;
  label: string;
};

export const mainNavigation: NavItem[] = [
  { id: 'dashboard', label: 'Главная' },
  { id: 'library', label: 'Библиотека' },
  { id: 'flashcards', label: 'Карточки' },
  { id: 'learn', label: 'Обучение' },
  { id: 'test', label: 'Тест' },
  { id: 'match', label: 'Сопоставление' },
  { id: 'statistics', label: 'Статистика' },
  { id: 'settings', label: 'Настройки' },
];
