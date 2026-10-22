import styled from 'styled-components';

import type { LearnCard } from '@/features/learn/model/types';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';

type LearnCardPickerProps = {
  card: LearnCard;
  selectedCount: number;
  sessionTarget: number;
  onAdd: () => void;
  onSkip: () => void;
};

const Counter = styled.p`
  margin: 0 0 16px;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Term = styled.p`
  margin: 0 0 12px;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
`;

const Definition = styled.p`
  margin: 0 0 24px;
  font-size: 1rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
`;

const Hint = styled.p`
  margin: 16px 0 0;
  font-size: 0.8125rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function LearnCardPicker({
  card,
  selectedCount,
  sessionTarget,
  onAdd,
  onSkip,
}: LearnCardPickerProps) {
  return (
    <Card>
      <Counter>
        Выбрано {selectedCount} из {sessionTarget}
      </Counter>
      <Term>{card.term}</Term>
      <Definition>{card.definition}</Definition>
      <Actions>
        <Button onClick={onAdd}>Взять в сессию</Button>
        <Button variant="secondary" onClick={onSkip}>Пропустить</Button>
      </Actions>
      <Hint>
        Просматривайте неизученные слова и добавляйте те, которые хотите
        выучить сейчас.
      </Hint>
    </Card>
  );
}
