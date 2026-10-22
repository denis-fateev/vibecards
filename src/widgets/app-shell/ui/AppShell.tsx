import type { ReactNode } from 'react';
import styled from 'styled-components';

import { APP_NAME } from '@/shared/config/app';
import { mainNavigation } from '@/shared/config/navigation';

type AppShellProps = {
  children: ReactNode;
};

const Root = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  height: ${({ theme }) => theme.layout.headerHeight};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

const HeaderInner = styled.div`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  height: 100%;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 24px;
`;

const Logo = styled.span`
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: -0.02em;
  white-space: nowrap;
`;

const Nav = styled.nav`
  display: flex;
  gap: 4px;
  overflow-x: auto;
  flex: 1;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const NavButton = styled.button<{ $active?: boolean }>`
  flex-shrink: 0;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 8px 12px;
  cursor: ${({ $active }) => ($active ? 'default' : 'not-allowed')};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accent : theme.colors.textMuted};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.accentMuted : 'transparent'};
  font-size: 0.875rem;
  font-weight: 500;
  opacity: ${({ $active }) => ($active ? 1 : 0.75)};
`;

const Main = styled.main`
  flex: 1;
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 24px 16px 40px;
`;

export function AppShell({ children }: AppShellProps) {
  return (
    <Root>
      <Header>
        <HeaderInner>
          <Logo>{APP_NAME}</Logo>
          <Nav aria-label="Основные разделы">
            {mainNavigation.map((item) => (
              <NavButton
                key={item.id}
                type="button"
                $active={item.id === 'dashboard'}
                disabled={item.id !== 'dashboard'}
                aria-current={item.id === 'dashboard' ? 'page' : undefined}
              >
                {item.label}
              </NavButton>
            ))}
          </Nav>
        </HeaderInner>
      </Header>
      <Main>{children}</Main>
    </Root>
  );
}
