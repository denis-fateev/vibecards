export type CardFlashcardRatingValue = 'know' | 'dont-know';

export type CardFlashcardRating = {
  cardId: string;
  rating: CardFlashcardRatingValue;
  ratedAt: number;
};

export type KnowDontKnowStats = {
  totalCards: number;
  knowCount: number;
  dontKnowCount: number;
  unratedCount: number;
  accuracyPercent: number | null;
};
