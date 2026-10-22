export type FlashcardItem = {
  id: string;
  term: string;
  definition: string;
  notes: string;
};

export type FlashcardDirection = 'term-to-definition' | 'definition-to-term';

export type FlashcardRating = 'know' | 'dont-know';

export type FlashcardsSessionStats = {
  totalViewed: number;
  knowCount: number;
  dontKnowCount: number;
};
