import { useState } from 'react';
import styled from 'styled-components';

import {
  useDeleteStudySetMutation,
  useUpdateStudySetMutation,
} from '@/entities/study-set/api/queries';
import type { StudySetSummary } from '@/entities/study-set/model/types';
import { Button } from '@/shared/ui/Button';

const Root = styled.li`
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const SetTitle = styled.div`
  font-weight: 600;
  font-size: 0.9375rem;
`;

const SetMeta = styled.div`
  margin-top: 4px;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Actions = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: 6px;
`;

const EditForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 4px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.8125rem;
  font-weight: 500;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 8px 10px;
  font-size: 0.875rem;
`;

const EditActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ErrorText = styled.p`
  margin: 8px 0 0;
  font-size: 0.8125rem;
  color: #b42318;
`;

type StudySetListItemProps = {
  set: StudySetSummary;
};

export function StudySetListItem({ set }: StudySetListItemProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(set.title);
  const [description, setDescription] = useState(set.description);
  const [error, setError] = useState<string | null>(null);

  const updateMutation = useUpdateStudySetMutation();
  const deleteMutation = useDeleteStudySetMutation();

  const startEdit = () => {
    setTitle(set.title);
    setDescription(set.description);
    setError(null);
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setError(null);
  };

  const saveEdit = async () => {
    setError(null);
    try {
      await updateMutation.mutateAsync({
        id: set.id,
        title,
        description,
      });
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось сохранить');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Удалить набор «${set.title}»? Карточки, которые есть только в этом наборе, тоже будут удалены. Это действие нельзя отменить.`,
    );
    if (!confirmed) return;

    setError(null);
    try {
      await deleteMutation.mutateAsync(set.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось удалить');
    }
  };

  if (editing) {
    return (
      <Root>
        <EditForm>
          <Label>
            Название
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </Label>
          <Label>
            Описание
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Label>
          <EditActions>
            <Button
              onClick={() => void saveEdit()}
              disabled={!title.trim() || updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Сохранение…' : 'Сохранить'}
            </Button>
            <Button variant="secondary" onClick={cancelEdit}>
              Отмена
            </Button>
          </EditActions>
        </EditForm>
        {error && <ErrorText>{error}</ErrorText>}
      </Root>
    );
  }

  return (
    <Root>
      <HeaderRow>
        <div>
          <SetTitle>{set.title}</SetTitle>
          <SetMeta>
            {set.cardCount} карточек
            {set.description ? ` · ${set.description}` : ''}
          </SetMeta>
        </div>
        <Actions>
          <Button variant="ghost" onClick={startEdit}>
            Изменить
          </Button>
          <Button
            variant="ghost"
            onClick={() => void handleDelete()}
            disabled={deleteMutation.isPending}
          >
            Удалить
          </Button>
        </Actions>
      </HeaderRow>
      {error && <ErrorText>{error}</ErrorText>}
    </Root>
  );
}
