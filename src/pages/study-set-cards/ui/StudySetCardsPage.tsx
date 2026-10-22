import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

import { useSetCards } from '@/entities/card/api/queries';
import { useStudySetSummaries } from '@/entities/study-set/api/queries';
import { SetCardsEditor } from '@/features/edit-set-cards';
import { flashcardsSessionRoute, routes } from '@/shared/config/routes';
import { Card } from '@/shared/ui/Card';
import { SectionTitle } from '@/shared/ui/SectionTitle';

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

const StudyLink = styled(Link)`
  display: inline-flex;
  margin-bottom: 16px;
  margin-left: 16px;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accent};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const TopLinks = styled.div`
  margin-bottom: 16px;
`;

export function StudySetCardsPage() {
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
        <BackLink to={routes.library}>← Библиотека</BackLink>
        <Empty>Набор не указан.</Empty>
      </>
    );
  }

  const title = set?.title ?? 'Набор';

  return (
    <>
      <TopLinks>
        <BackLink to={routes.library}>← Библиотека</BackLink>
        {cards.length > 0 && (
          <StudyLink to={flashcardsSessionRoute(setId)}>Учить карточки →</StudyLink>
        )}
      </TopLinks>
      <PageTitle>{title}</PageTitle>
      <PageLead>
        Редактирование карточек в наборе. Изменения сохраняются автоматически.
      </PageLead>

      <Card>
        <SectionTitle>Карточки</SectionTitle>
        {isLoading && <Empty>Загрузка…</Empty>}
        {isError && <Empty>Не удалось загрузить карточки.</Empty>}
        {!isLoading && !isError && (
          <SetCardsEditor setId={setId} cards={cards} />
        )}
      </Card>
    </>
  );
}
