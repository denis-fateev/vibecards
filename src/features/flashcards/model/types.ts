export type FlashcardItem = {
  id: string;
  term: string;
  definition: string;
  notes: string;
};

export type FlashcardDirection = 'term-to-definition' | 'definition-to-term';

export type { CardFlashcardRatingValue as FlashcardRating } from '@/entities/card-rating/model/types';

export type FlashcardsSessionStats = {
  totalViewed: number;
  knowCount: number;
  dontKnowCount: number;
};
