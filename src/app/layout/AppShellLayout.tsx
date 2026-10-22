import { Outlet } from 'react-router-dom';

import { AppShell } from '@/widgets/app-shell';

export function AppShellLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
