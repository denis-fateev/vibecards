import styled from 'styled-components';

import { useKnowDontKnowStats } from '@/entities/card-rating/api/queries';
import { Card } from '@/shared/ui/Card';
import { Placeholder } from '@/shared/ui/Placeholder';
import { SectionTitle } from '@/shared/ui/SectionTitle';

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;

  @media (min-width: 480px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
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

const Accuracy = styled.p`
  margin: 16px 0 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ProgressBar = styled.div`
  display: flex;
  width: 100%;
  height: 16px;
  margin-top: 20px;
  border-radius: ${({ theme }) => theme.radius.sm};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.border};
`;

const ProgressSegment = styled.div<{ $flex: number; $color: string }>`
  flex: ${({ $flex }) => $flex} 0 0;
  min-width: 0;
  background: ${({ $color }) => $color};
`;

const SEGMENT_COLORS = {
  know: '#2d9f6f',
  dontKnow: '#d94f4f',
  unrated: '#c5cad3',
} as const;

function segmentFlex(count: number, total: number): number {
  if (total <= 0 || count <= 0) return 0;
  return count / total;
}

export function DashboardProgress() {
  const { data, isLoading, isError } = useKnowDontKnowStats();

  return (
    <Card>
      <SectionTitle>Прогресс</SectionTitle>
      {isLoading && (
        <Placeholder>Загрузка статистики…</Placeholder>
      )}
      {isError && (
        <Placeholder>Не удалось загрузить статистику.</Placeholder>
      )}
      {data && (
        <>
          <StatsGrid>
            <Stat>
              <StatValue>{data.totalCards}</StatValue>
              <StatLabel>Всего карточек</StatLabel>
            </Stat>
            <Stat>
              <StatValue>{data.knowCount}</StatValue>
              <StatLabel>Знаю</StatLabel>
            </Stat>
            <Stat>
              <StatValue>{data.dontKnowCount}</StatValue>
              <StatLabel>Не знаю</StatLabel>
            </Stat>
            <Stat>
              <StatValue>{data.unratedCount}</StatValue>
              <StatLabel>Без оценки</StatLabel>
            </Stat>
          </StatsGrid>
          {data.accuracyPercent != null && (
            <Accuracy>
              Доля «Знаю» среди оценённых: {data.accuracyPercent}%
            </Accuracy>
          )}
          {data.totalCards === 0 && (
            <Accuracy>Добавьте карточки в библиотеке и пройдите режим «Карточки».</Accuracy>
          )}
          <ProgressBar
            role="img"
            aria-label={`Знаю ${data.knowCount}, не знаю ${data.dontKnowCount}, без оценки ${data.unratedCount}`}
          >
            <ProgressSegment
              $flex={segmentFlex(data.knowCount, data.totalCards)}
              $color={SEGMENT_COLORS.know}
            />
            <ProgressSegment
              $flex={segmentFlex(data.dontKnowCount, data.totalCards)}
              $color={SEGMENT_COLORS.dontKnow}
            />
            <ProgressSegment
              $flex={segmentFlex(data.unratedCount, data.totalCards)}
              $color={SEGMENT_COLORS.unrated}
            />
          </ProgressBar>
        </>
      )}
    </Card>
  );
}
