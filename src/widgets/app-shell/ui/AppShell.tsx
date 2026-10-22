import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { APP_NAME } from '@/shared/config/app';
import { mainNavigation } from '@/shared/config/navigation';
import { routes } from '@/shared/config/routes';

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

const LogoLink = styled(NavLink)`
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: -0.02em;
  white-space: nowrap;
  color: inherit;
  text-decoration: none;
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

const NavItemLink = styled(NavLink)`
  flex-shrink: 0;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 8px 12px;
  cursor: pointer;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  background: transparent;
  opacity: 0.85;

  &.active {
    color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentMuted};
    opacity: 1;
    cursor: default;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
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
          <LogoLink to={routes.dashboard} end>{APP_NAME}</LogoLink>
          <Nav aria-label="Основные разделы">
            {mainNavigation.map((item) => (
              <NavItemLink
                key={item.id}
                to={routes[item.id]}
                end={item.id === 'dashboard'}
              >
                {item.label}
              </NavItemLink>
            ))}
          </Nav>
        </HeaderInner>
      </Header>
      <Main>{children}</Main>
    </Root>
  );
}
