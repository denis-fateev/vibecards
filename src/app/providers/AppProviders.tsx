import type { PropsWithChildren } from 'react';
import { ThemeProvider } from 'styled-components';

import { GlobalStyle } from '@/app/styles/GlobalStyle';
import { theme } from '@/app/styles/theme';

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  );
}
