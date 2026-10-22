import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import type { SetCardRow } from '@/entities/card/api/cardApi';
import {
  useRemoveCardFromSetMutation,
  useUpdateCardInSetMutation,
} from '@/entities/card/api/queries';
import { Button } from '@/shared/ui/Button';

const TableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`;

const Th = styled.th`
  text-align: left;
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textMuted};
  padding: 10px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

const Td = styled.td`
  padding: 8px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  vertical-align: top;

  tr:last-child & {
    border-bottom: none;
  }
`;

const CellInput = styled.textarea`
  width: 100%;
  min-height: 2.5rem;
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 6px 8px;
  font-size: 0.875rem;
  font-family: inherit;
  resize: vertical;
  background: transparent;

  &:hover {
    border-color: ${({ theme }) => theme.colors.border};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.surface};
  }
`;

const RowError = styled.div`
  margin-top: 4px;
  font-size: 0.75rem;
  color: #b42318;
`;

const Status = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Empty = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SAVE_DEBOUNCE_MS = 600;

type RowDraft = {
  term: string;
  definition: string;
};

type SetCardsEditorProps = {
  setId: string;
  cards: SetCardRow[];
};

function draftsFromCards(cards: SetCardRow[]): Record<string, RowDraft> {
  return Object.fromEntries(
    cards.map((c) => [c.id, { term: c.term, definition: c.definition }]),
  );
}

function SetCardEditorRow({
  setId,
  card,
  draft,
  onDraftChange,
}: {
  setId: string;
  card: SetCardRow;
  draft: RowDraft;
  onDraftChange: (cardId: string, draft: RowDraft) => void;
}) {
  const updateMutation = useUpdateCardInSetMutation(setId);
  const removeMutation = useRemoveCardFromSetMutation(setId);
  const [rowError, setRowError] = useState<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef(draft);

  useEffect(() => {
    lastSavedRef.current = { term: card.term, definition: card.definition };
  }, [card.term, card.definition]);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const scheduleSave = (next: RowDraft) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      void persist(next);
    }, SAVE_DEBOUNCE_MS);
  };

  const persist = async (next: RowDraft) => {
    const term = next.term.trim();
    const definition = next.definition.trim();
    if (
      term === lastSavedRef.current.term &&
      definition === lastSavedRef.current.definition
    ) {
      return;
    }
    if (!term || !definition) {
      setRowError('Заполните термин и определение');
      return;
    }

    setRowError(null);
    try {
      await updateMutation.mutateAsync({
        cardId: card.id,
        term: next.term,
        definition: next.definition,
      });
      lastSavedRef.current = { term, definition };
    } catch (err) {
      setRowError(err instanceof Error ? err.message : 'Не удалось сохранить');
    }
  };

  const handleChange = (field: 'term' | 'definition', value: string) => {
    const next = { ...draft, [field]: value };
    onDraftChange(card.id, next);
    scheduleSave(next);
  };

  const handleBlur = () => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    void persist(draft);
  };

  const handleDelete = async () => {
    const label = draft.term.trim() || card.term;
    const confirmed = window.confirm(
      `Удалить карточку «${label}» из набора?`,
    );
    if (!confirmed) return;

    setRowError(null);
    try {
      await removeMutation.mutateAsync(card.id);
    } catch (err) {
      setRowError(err instanceof Error ? err.message : 'Не удалось удалить');
    }
  };

  const saving = updateMutation.isPending;
  const deleting = removeMutation.isPending;

  return (
    <tr>
      <Td>
        <CellInput
          value={draft.term}
          onChange={(e) => handleChange('term', e.target.value)}
          onBlur={handleBlur}
          rows={2}
          aria-label="Термин"
        />
      </Td>
      <Td>
        <CellInput
          value={draft.definition}
          onChange={(e) => handleChange('definition', e.target.value)}
          onBlur={handleBlur}
          rows={2}
          aria-label="Определение"
        />
        {rowError && <RowError>{rowError}</RowError>}
      </Td>
      <Td>
        <Button
          variant="ghost"
          onClick={() => void handleDelete()}
          disabled={deleting || saving}
        >
          {deleting ? '…' : 'Удалить'}
        </Button>
        {saving && <Status> Сохранение…</Status>}
      </Td>
    </tr>
  );
}

export function SetCardsEditor({ setId, cards }: SetCardsEditorProps) {
  const [drafts, setDrafts] = useState<Record<string, RowDraft>>(() =>
    draftsFromCards(cards),
  );

  useEffect(() => {
    setDrafts((prev) => {
      const next = draftsFromCards(cards);
      for (const id of Object.keys(prev)) {
        if (next[id]) {
          next[id] = prev[id];
        }
      }
      return next;
    });
  }, [cards]);

  const onDraftChange = (cardId: string, draft: RowDraft) => {
    setDrafts((prev) => ({ ...prev, [cardId]: draft }));
  };

  if (cards.length === 0) {
    return <Empty>В этом наборе пока нет карточек.</Empty>;
  }

  return (
    <TableWrap>
      <Table>
        <thead>
          <tr>
            <Th>Термин</Th>
            <Th>Определение</Th>
            <Th style={{ width: '7rem' }} />
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <SetCardEditorRow
              key={card.id}
              setId={setId}
              card={card}
              draft={drafts[card.id] ?? { term: card.term, definition: card.definition }}
              onDraftChange={onDraftChange}
            />
          ))}
        </tbody>
      </Table>
    </TableWrap>
  );
}
