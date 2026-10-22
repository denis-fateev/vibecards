import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  listCardsInSet,
  removeCardFromSet,
  updateCardInSet,
} from '@/entities/card/api/cardApi';
import { studySetQueryKey } from '@/entities/study-set/api/queries';

export function studySetCardsQueryKey(setId: string) {
  return ['studySetCards', setId] as const;
}

export function useSetCards(setId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: studySetCardsQueryKey(setId),
    queryFn: () => listCardsInSet(setId),
    enabled: options?.enabled ?? Boolean(setId),
  });
}

export function useUpdateCardInSetMutation(setId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      cardId: string;
      term: string;
      definition: string;
      notes?: string;
    }) =>
      updateCardInSet(setId, input.cardId, {
        term: input.term,
        definition: input.definition,
        notes: input.notes,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: studySetCardsQueryKey(setId),
      });
      void queryClient.invalidateQueries({ queryKey: studySetQueryKey });
    },
  });
}

export function useRemoveCardFromSetMutation(setId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cardId: string) => removeCardFromSet(setId, cardId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: studySetCardsQueryKey(setId),
      });
      void queryClient.invalidateQueries({ queryKey: studySetQueryKey });
    },
  });
}
