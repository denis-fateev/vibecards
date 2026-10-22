import { Link } from 'react-router-dom';
import styled from 'styled-components';

import type { LearnCard } from '@/features/learn/model/types';
import { learnSessionRoute, routes } from '@/shared/config/routes';
import { Card } from '@/shared/ui/Card';
import { SectionTitle } from '@/shared/ui/SectionTitle';

type LearnCompleteProps = {
  setId: string;
  setTitle: string;
  cards: LearnCard[];
  errorCounts: Record<string, number>;
  allLearned?: boolean;
};

const Lead = styled.p`
  margin: 0 0 20px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9375rem;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.875rem;

  &:last-child {
    border-bottom: none;
  }
`;

const Term = styled.span`
  font-weight: 600;
`;

const ErrorCount = styled.span<{ $zero: boolean }>`
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${({ theme, $zero }) =>
    $zero ? theme.colors.success : theme.colors.danger};
  white-space: nowrap;
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

const PrimaryLink = styled(TextLink)`
  border-color: ${({ theme }) => theme.colors.accent};
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
`;

export function LearnComplete({
  setId,
  setTitle,
  cards,
  errorCounts,
  allLearned,
}: LearnCompleteProps) {
  if (allLearned) {
    return (
      <Card>
        <SectionTitle>Все слова изучены</SectionTitle>
        <Lead>
          В наборе «{setTitle}» не осталось неизученных карточек. Вы можете
          повторить набор позже или выбрать другой.
        </Lead>
        <Actions>
          <TextLink to={routes.learn}>К обучению</TextLink>
          <PrimaryLink to={routes.library}>Библиотека</PrimaryLink>
        </Actions>
      </Card>
    );
  }

  const totalErrors = Object.values(errorCounts).reduce((a, b) => a + b, 0);

  return (
    <Card>
      <SectionTitle>Сессия завершена</SectionTitle>
      <Lead>
        Набор «{setTitle}». Изучено слов: {cards.length}. Всего ошибок:{' '}
        {totalErrors}.
      </Lead>
      <List aria-label="Статистика ошибок по словам">
        {cards.map((card) => {
          const count = errorCounts[card.id] ?? 0;
          return (
            <Item key={card.id}>
              <Term>{card.term}</Term>
              <ErrorCount $zero={count === 0} aria-label={`Ошибок: ${count}`}>
                {count}
              </ErrorCount>
            </Item>
          );
        })}
      </List>
      <Actions>
        <PrimaryLink to={learnSessionRoute(setId)}>Ещё раз</PrimaryLink>
        <TextLink to={routes.learn}>Другой набор</TextLink>
      </Actions>
    </Card>
  );
}
