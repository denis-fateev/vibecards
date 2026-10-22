import type { CardLearnProgress } from '@/entities/card-learn-progress/model/types';
import { db } from '@/shared/db/db';

export async function listLearnedCardIdsInSet(setId: string): Promise<string[]> {
  const rows = await db.cardLearnProgress
    .where('setId')
    .equals(setId)
    .toArray();
  return rows.map((r) => r.cardId);
}

export async function markCardsLearnedInSet(
  setId: string,
  cardIds: string[],
): Promise<void> {
  const now = Date.now();
  const rows: CardLearnProgress[] = cardIds.map((cardId) => ({
    cardId,
    setId,
    completedAt: now,
  }));
  await db.cardLearnProgress.bulkPut(rows);
}
