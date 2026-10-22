import type { NavItemId } from '@/shared/config/navigation';

export const routes: Record<NavItemId, string> = {
  dashboard: '/',
  library: '/library',
  flashcards: '/flashcards',
  learn: '/learn',
  test: '/test',
  match: '/match',
  statistics: '/statistics',
  settings: '/settings',
};

export function studySetCardsRoute(setId: string): string {
  return `/library/${setId}/cards`;
}

export function flashcardsSessionRoute(setId: string): string {
  return `/flashcards/${setId}`;
}

export function learnSessionRoute(setId: string): string {
  return `/learn/${setId}`;
}
