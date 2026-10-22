import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  listLearnedCardIdsInSet,
  markCardsLearnedInSet,
} from '@/entities/card-learn-progress/api/cardLearnProgressApi';
import { studySetCardsQueryKey } from '@/entities/card/api/queries';
import { studySetQueryKey } from '@/entities/study-set/api/queries';

export function learnedCardsQueryKey(setId: string) {
  return ['learnedCards', setId] as const;
}

export function useLearnedCardIds(setId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: learnedCardsQueryKey(setId),
    queryFn: () => listLearnedCardIdsInSet(setId),
    enabled: options?.enabled ?? Boolean(setId),
  });
}

export function useMarkCardsLearnedMutation(setId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (cardIds: string[]) => markCardsLearnedInSet(setId, cardIds),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: learnedCardsQueryKey(setId),
      });
      void queryClient.invalidateQueries({ queryKey: studySetQueryKey });
      void queryClient.invalidateQueries({
        queryKey: studySetCardsQueryKey(setId),
      });
    },
  });
}
