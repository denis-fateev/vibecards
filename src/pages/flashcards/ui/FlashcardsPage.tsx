import styled from 'styled-components';

import { useStudySetSummaries } from '@/entities/study-set/api/queries';
import { FlashcardsSetPicker } from '@/features/flashcards';

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

const Empty = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function FlashcardsPage() {
  const { data: sets = [], isLoading, isError } = useStudySetSummaries();

  return (
    <>
      <PageTitle>Карточки</PageTitle>
      <PageLead>
        Классический режим: переворачивайте карточки, отмечайте «Знаю» и «Не
        знаю», меняйте направление перевода и перемешивайте порядок.
      </PageLead>
      {isLoading && <Empty>Загрузка наборов…</Empty>}
      {isError && <Empty>Не удалось загрузить наборы.</Empty>}
      {!isLoading && !isError && <FlashcardsSetPicker sets={sets} />}
    </>
  );
}
