import styled from 'styled-components';

import { DashboardActivity } from '@/widgets/dashboard-activity';
import { DashboardContinueLearning } from '@/widgets/dashboard-continue-learning';
import { DashboardProgress } from '@/widgets/dashboard-progress';
import { DashboardQuickActions } from '@/widgets/dashboard-quick-actions';
import { DashboardToday } from '@/widgets/dashboard-today';

const PageTitle = styled.h1`
  margin: 0 0 8px;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.03em;
`;

const PageLead = styled.p`
  margin: 0 0 24px;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 42rem;
`;

const Grid = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(12, minmax(0, 1fr));

    & > *:nth-child(1) {
      grid-column: span 6;
    }
    & > *:nth-child(2) {
      grid-column: span 6;
    }
    & > *:nth-child(3) {
      grid-column: span 12;
    }
    & > *:nth-child(4) {
      grid-column: span 7;
    }
    & > *:nth-child(5) {
      grid-column: span 5;
    }
  }
`;

export function DashboardPage() {
  return (
    <>
      <PageTitle>Главная</PageTitle>
      <PageLead>Краткий обзор прогресса и быстрый доступ к обучению.</PageLead>
      <Grid>
        <DashboardToday />
        <DashboardProgress />
        <DashboardContinueLearning />
        <DashboardActivity />
        <DashboardQuickActions />
      </Grid>
    </>
  );
}
