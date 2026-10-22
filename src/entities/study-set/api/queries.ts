import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  deleteStudySet,
  importCardsToNewSet,
  importCardsToSet,
  listStudySetSummaries,
  updateStudySet,
} from '@/entities/study-set/api/studySetApi';
import type { CardDraft } from '@/entities/card/model/types';

export const studySetQueryKey = ['studySets'] as const;

export function useStudySetSummaries() {
  return useQuery({
    queryKey: studySetQueryKey,
    queryFn: listStudySetSummaries,
  });
}

export function useImportCardsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      mode: 'new' | 'existing';
      setId?: string;
      title?: string;
      description?: string;
      cards: CardDraft[];
    }) => {
      if (input.mode === 'new') {
        if (!input.title?.trim()) {
          throw new Error('Укажите название набора');
        }
        return importCardsToNewSet(
          input.title.trim(),
          input.description?.trim() ?? '',
          input.cards,
        );
      }
      if (!input.setId) {
        throw new Error('Выберите набор');
      }
      return importCardsToSet(input.setId, input.cards);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: studySetQueryKey });
    },
  });
}

export function useUpdateStudySetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      id: string;
      title: string;
      description?: string;
    }) => updateStudySet(input.id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: studySetQueryKey });
    },
  });
}

export function useDeleteStudySetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteStudySet(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: studySetQueryKey });
    },
  });
}
