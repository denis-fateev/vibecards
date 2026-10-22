import { AppProviders } from '@/app/providers/AppProviders';
import { DashboardPage } from '@/pages/dashboard';

export function App() {
  return (
    <AppProviders>
      <DashboardPage />
    </AppProviders>
  );
}
