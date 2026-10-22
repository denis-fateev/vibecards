import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { ThemeProvider } from 'styled-components';

import { DbInitProvider } from '@/app/providers/DbInitProvider';
import { GlobalStyle } from '@/app/styles/GlobalStyle';
import { theme } from '@/app/styles/theme';

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <DbInitProvider>{children}</DbInitProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
