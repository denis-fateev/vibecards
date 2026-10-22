import { Link } from 'react-router-dom';
import styled from 'styled-components';

import type { StudySetSummary } from '@/entities/study-set/model/types';
import { learnSessionRoute, routes } from '@/shared/config/routes';
import { Card } from '@/shared/ui/Card';
import { SectionTitle } from '@/shared/ui/SectionTitle';

type LearnSetPickerProps = {
  sets: StudySetSummary[];
};

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Item = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const ItemTitle = styled.span`
  font-weight: 600;
  font-size: 0.9375rem;
`;

const Meta = styled.span`
  display: block;
  margin-top: 4px;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StartLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  border: 1px solid ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 8px 14px;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  background: ${({ theme }) => theme.colors.accent};
  color: #fff;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const Empty = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function LearnSetPicker({ sets }: LearnSetPickerProps) {
  const withCards = sets.filter((s) => s.cardCount > 0);

  return (
    <Card>
      <SectionTitle>Выберите набор</SectionTitle>
      {withCards.length === 0 && (
        <Empty>
          Нет наборов с карточками.{' '}
          <Link to={routes.library}>Создайте набор в библиотеке</Link>.
        </Empty>
      )}
      <List>
        {withCards.map((set) => (
          <Item key={set.id}>
            <div>
              <ItemTitle>{set.title}</ItemTitle>
              <Meta>{set.cardCount} карточек</Meta>
            </div>
            <StartLink to={learnSessionRoute(set.id)}>Изучать</StartLink>
          </Item>
        ))}
      </List>
    </Card>
  );
}
