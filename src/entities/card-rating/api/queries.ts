import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getKnowDontKnowStats,
  saveCardFlashcardRating,
} from '@/entities/card-rating/api/cardRatingApi';
import type { CardFlashcardRatingValue } from '@/entities/card-rating/model/types';

export const knowDontKnowStatsQueryKey = ['knowDontKnowStats'] as const;

export function useKnowDontKnowStats() {
  return useQuery({
    queryKey: knowDontKnowStatsQueryKey,
    queryFn: getKnowDontKnowStats,
  });
}

export function useSaveCardFlashcardRatingMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      cardId: string;
      rating: CardFlashcardRatingValue;
    }) =>
      saveCardFlashcardRating(input.cardId, input.rating),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: knowDontKnowStatsQueryKey,
      });
    },
  });
}
