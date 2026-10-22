import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { useSetCards } from '@/entities/card/api/queries';
import { useLearnedCardIds } from '@/entities/card-learn-progress/api/queries';
import { useStudySetSummaries } from '@/entities/study-set/api/queries';
import { LearnSession } from '@/features/learn';
import { routes } from '@/shared/config/routes';

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 16px;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Empty = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function LearnSessionPage() {
  const { setId = '' } = useParams<{ setId: string }>();
  const { data: sets = [] } = useStudySetSummaries();
  const set = sets.find((s) => s.id === setId);
  const {
    data: cards = [],
    isLoading: cardsLoading,
    isError: cardsError,
  } = useSetCards(setId, { enabled: Boolean(setId) });
  const {
    data: learnedCardIds = [],
    isLoading: learnedLoading,
    isError: learnedError,
  } = useLearnedCardIds(setId, { enabled: Boolean(setId) });

  if (!setId) {
    return (
      <>
        <BackLink to={routes.learn}>← Обучение</BackLink>
        <Empty>Набор не указан.</Empty>
      </>
    );
  }

  const title = set?.title ?? 'Набор';
  const isLoading = cardsLoading || learnedLoading;
  const isError = cardsError || learnedError;

  return (
    <>
      <BackLink to={routes.learn}>← Все наборы</BackLink>
      {isLoading && <Empty>Загрузка…</Empty>}
      {isError && <Empty>Не удалось загрузить данные.</Empty>}
      {!isLoading && !isError && (
        <LearnSession
          key={setId}
          setId={setId}
          setTitle={title}
          cards={cards}
          learnedCardIds={learnedCardIds}
        />
      )}
    </>
  );
}
