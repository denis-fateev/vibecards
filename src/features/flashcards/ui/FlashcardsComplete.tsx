import { Link } from 'react-router-dom';
import styled from 'styled-components';

import type { FlashcardsSessionStats } from '@/features/flashcards/model/types';
import { studySetCardsRoute } from '@/shared/config/routes';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { SectionTitle } from '@/shared/ui/SectionTitle';

type FlashcardsCompleteProps = {
  setId: string;
  setTitle: string;
  stats: FlashcardsSessionStats;
  hasWrongCards: boolean;
  onRepeatWrong: () => void;
  onStudyAgain: () => void;
};

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
`;

const Stat = styled.div`
  padding: 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bg};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
`;

const StatLabel = styled.div`
  margin-top: 4px;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
`;

const TextLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 8px 14px;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

export function FlashcardsComplete({
  setId,
  setTitle,
  stats,
  hasWrongCards,
  onRepeatWrong,
  onStudyAgain,
}: FlashcardsCompleteProps) {
  return (
    <Card>
      <SectionTitle>Сессия завершена</SectionTitle>
      <p style={{ margin: '8px 0 0', color: '#5c6570' }}>
        Набор «{setTitle}»
      </p>
      <StatsGrid>
        <Stat>
          <StatValue>{stats.totalViewed}</StatValue>
          <StatLabel>Просмотрено</StatLabel>
        </Stat>
        <Stat>
          <StatValue>{stats.knowCount}</StatValue>
          <StatLabel>Знаю</StatLabel>
        </Stat>
        <Stat>
          <StatValue>{stats.dontKnowCount}</StatValue>
          <StatLabel>Не знаю</StatLabel>
        </Stat>
      </StatsGrid>
      <Actions>
        {hasWrongCards && (
          <Button onClick={onRepeatWrong}>Повторить сложные</Button>
        )}
        <Button variant="secondary" onClick={onStudyAgain}>
          Пройти снова
        </Button>
        <TextLink to={studySetCardsRoute(setId)}>Вернуться к набору</TextLink>
      </Actions>
    </Card>
  );
}
