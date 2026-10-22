import { deleteCardFlashcardRating } from '@/entities/card-rating/api/cardRatingApi';
import type { Card } from '@/entities/card/model/types';
import { db } from '@/shared/db/db';

export type SetCardRow = {
  id: string;
  term: string;
  definition: string;
  notes: string;
  position: number;
};

export async function listCardsInSet(setId: string): Promise<SetCardRow[]> {
  const studySet = await db.studySets.get(setId);
  if (!studySet) {
    throw new Error('Набор не найден');
  }

  const links = await db.setCards.where('setId').equals(setId).sortBy('position');
  if (links.length === 0) {
    return [];
  }

  const cardIds = links.map((l) => l.cardId);
  const cards = await db.cards.bulkGet(cardIds);
  const cardById = new Map(
    cards.filter((c): c is Card => c != null).map((c) => [c.id, c]),
  );

  return links
    .map((link) => {
      const card = cardById.get(link.cardId);
      if (!card) return null;
      return {
        id: card.id,
        term: card.term,
        definition: card.definition,
        notes: card.notes,
        position: link.position,
      };
    })
    .filter((row): row is SetCardRow => row != null);
}

export async function updateCardInSet(
  setId: string,
  cardId: string,
  input: { term: string; definition: string; notes?: string },
): Promise<Card> {
  const term = input.term.trim();
  const definition = input.definition.trim();
  if (!term || !definition) {
    throw new Error('Заполните термин и определение');
  }

  const link = await db.setCards.get([setId, cardId]);
  if (!link) {
    throw new Error('Карточка не найдена в наборе');
  }

  const existing = await db.cards.get(cardId);
  if (!existing) {
    throw new Error('Карточка не найдена');
  }

  const links = await db.setCards.where('setId').equals(setId).toArray();
  const otherIds = links.map((l) => l.cardId).filter((id) => id !== cardId);
  if (otherIds.length > 0) {
    const others = await db.cards.bulkGet(otherIds);
    const key = term.toLowerCase();
    for (const c of others) {
      if (c && c.term.trim().toLowerCase() === key) {
        throw new Error('Такой термин уже есть в наборе');
      }
    }
  }

  const now = Date.now();
  const updated: Card = {
    ...existing,
    term,
    definition,
    notes: input.notes?.trim() ?? existing.notes,
    updatedAt: now,
  };

  await db.transaction('rw', db.studySets, db.cards, async () => {
    await db.cards.put(updated);
    await db.studySets.update(setId, { updatedAt: now });
  });

  return updated;
}

export async function removeCardFromSet(
  setId: string,
  cardId: string,
): Promise<void> {
  const link = await db.setCards.get([setId, cardId]);
  if (!link) {
    throw new Error('Карточка не найдена в наборе');
  }

  await db.transaction(
    'rw',
    db.studySets,
    db.setCards,
    db.cards,
    db.cardRatings,
    async () => {
      await db.setCards.delete([setId, cardId]);
      const remaining = await db.setCards.where('cardId').equals(cardId).count();
      if (remaining === 0) {
        await db.cards.delete(cardId);
        await deleteCardFlashcardRating(cardId);
      }
      await db.studySets.update(setId, { updatedAt: Date.now() });
    },
  );
}
