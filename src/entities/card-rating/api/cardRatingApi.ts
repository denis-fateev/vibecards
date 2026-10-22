import type {
  CardFlashcardRating,
  CardFlashcardRatingValue,
  KnowDontKnowStats,
} from '@/entities/card-rating/model/types';
import { db } from '@/shared/db/db';

export async function saveCardFlashcardRating(
  cardId: string,
  rating: CardFlashcardRatingValue,
): Promise<void> {
  const row: CardFlashcardRating = {
    cardId,
    rating,
    ratedAt: Date.now(),
  };
  await db.cardRatings.put(row);
}

export async function getKnowDontKnowStats(): Promise<KnowDontKnowStats> {
  const [totalCards, ratings, cards] = await Promise.all([
    db.cards.count(),
    db.cardRatings.toArray(),
    db.cards.toArray(),
  ]);
  const existingIds = new Set(cards.map((c) => c.id));

  let knowCount = 0;
  let dontKnowCount = 0;
  for (const row of ratings) {
    if (!existingIds.has(row.cardId)) continue;
    if (row.rating === 'know') knowCount += 1;
    else dontKnowCount += 1;
  }

  const ratedCount = knowCount + dontKnowCount;
  const unratedCount = Math.max(0, totalCards - ratedCount);
  const accuracyPercent =
    ratedCount > 0 ? Math.round((knowCount / ratedCount) * 100) : null;

  return {
    totalCards,
    knowCount,
    dontKnowCount,
    unratedCount,
    accuracyPercent,
  };
}

export async function deleteCardFlashcardRating(cardId: string): Promise<void> {
  await db.cardRatings.delete(cardId);
}
