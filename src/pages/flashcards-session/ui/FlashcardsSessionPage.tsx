import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { useSetCards } from '@/entities/card/api/queries';
import { useStudySetSummaries } from '@/entities/study-set/api/queries';
import { FlashcardsSession } from '@/features/flashcards';
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

export function FlashcardsSessionPage() {
  const { setId = '' } = useParams<{ setId: string }>();
  const { data: sets = [] } = useStudySetSummaries();
  const set = sets.find((s) => s.id === setId);
  const {
    data: cards = [],
    isLoading,
    isError,
  } = useSetCards(setId, { enabled: Boolean(setId) });

  if (!setId) {
    return (
      <>
        <BackLink to={routes.flashcards}>← Карточки</BackLink>
        <Empty>Набор не указан.</Empty>
      </>
    );
  }

  const title = set?.title ?? 'Набор';

  return (
    <>
      <BackLink to={routes.flashcards}>← Все наборы</BackLink>
      {isLoading && <Empty>Загрузка карточек…</Empty>}
      {isError && <Empty>Не удалось загрузить карточки.</Empty>}
      {!isLoading && !isError && (
        <FlashcardsSession setId={setId} setTitle={title} cards={cards} />
      )}
    </>
  );
}
