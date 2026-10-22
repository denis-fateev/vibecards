import styled from 'styled-components';

import { useStudySetSummaries } from '@/entities/study-set/api/queries';
import { ImportCardsPanel } from '@/features/import-cards';
import { StudySetListItem } from '@/features/manage-study-set';
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

const Layout = styled.div`
  display: grid;
  gap: 16px;

  @media (min-width: 900px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
    align-items: start;
  }
`;

const SetList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Empty = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function LibraryPage() {
  const { data: sets = [], isLoading, isError } = useStudySetSummaries();

  return (
    <>
      <PageTitle>Библиотека</PageTitle>
      <PageLead>
        Наборы карточек и импорт из CSV или TSV. При первом запуске добавлен
        тестовый набор C2 Vocabulary на 40 слов.
      </PageLead>

      <Layout>
        <Card>
          <SectionTitle>Мои наборы</SectionTitle>
          {isLoading && <Empty>Загрузка…</Empty>}
          {isError && <Empty>Не удалось загрузить наборы.</Empty>}
          {!isLoading && !isError && sets.length === 0 && (
            <Empty>Наборов пока нет. Импортируйте файл справа.</Empty>
          )}
          <SetList>
            {sets.map((set) => (
              <StudySetListItem key={set.id} set={set} />
            ))}
          </SetList>
        </Card>

        <Card>
          <SectionTitle>Импорт</SectionTitle>
          <ImportCardsPanel sets={sets} />
        </Card>
      </Layout>
    </>
  );
}
