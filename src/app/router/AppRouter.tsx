import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppShellLayout } from '@/app/layout/AppShellLayout';
import { DashboardPage } from '@/pages/dashboard';
import { LibraryPage } from '@/pages/library';
import { FlashcardsPage } from '@/pages/flashcards';
import { FlashcardsSessionPage } from '@/pages/flashcards-session';
import { StudySetCardsPage } from '@/pages/study-set-cards';
import { PlaceholderPage } from '@/pages/placeholder';
import { getAppBasename } from '@/shared/config/appBasename';
import { mainNavigation } from '@/shared/config/navigation';
import { routes } from '@/shared/config/routes';

export function AppRouter() {
  return (
    <BrowserRouter basename={getAppBasename()}>
      <Routes>
        <Route element={<AppShellLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path={routes.library.slice(1)} element={<LibraryPage />} />
          <Route path="library/:setId/cards" element={<StudySetCardsPage />} />
          <Route path={routes.flashcards.slice(1)} element={<FlashcardsPage />} />
          <Route
            path="flashcards/:setId"
            element={<FlashcardsSessionPage />}
          />
          {mainNavigation
            .filter(
              (item) =>
                item.id !== 'dashboard' &&
                item.id !== 'library' &&
                item.id !== 'flashcards',
            )
            .map((item) => (
              <Route
                key={item.id}
                path={routes[item.id].slice(1)}
                element={<PlaceholderPage section={item} />}
              />
            ))}
          <Route path="*" element={<Navigate to={routes.dashboard} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
