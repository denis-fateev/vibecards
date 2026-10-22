import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppShellLayout } from '@/app/layout/AppShellLayout';
import { DashboardPage } from '@/pages/dashboard';
import { LibraryPage } from '@/pages/library';
import { PlaceholderPage } from '@/pages/placeholder';
import { mainNavigation } from '@/shared/config/navigation';
import { routes } from '@/shared/config/routes';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShellLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path={routes.library.slice(1)} element={<LibraryPage />} />
          {mainNavigation
            .filter(
              (item) => item.id !== 'dashboard' && item.id !== 'library',
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
