import type { CardDraft } from '@/entities/card/model/types';
import type { StudySet, StudySetSummary } from '@/entities/study-set/model/types';
import { db } from '@/shared/db/db';
import { createId } from '@/shared/lib/createId';

export async function listStudySetSummaries(): Promise<StudySetSummary[]> {
  const sets = await db.studySets.orderBy('updatedAt').reverse().toArray();
  const summaries = await Promise.all(
    sets.map(async (set) => {
      const cardCount = await db.setCards.where('setId').equals(set.id).count();
      return { ...set, cardCount };
    }),
  );
  return summaries;
}

export async function getStudySet(id: string): Promise<StudySet | undefined> {
  return db.studySets.get(id);
}

export async function createStudySet(input: {
  title: string;
  description?: string;
}): Promise<StudySet> {
  const now = Date.now();
  const studySet: StudySet = {
    id: createId(),
    title: input.title.trim(),
    description: input.description?.trim() ?? '',
    createdAt: now,
    updatedAt: now,
  };
  await db.studySets.add(studySet);
  return studySet;
}

export type ImportCardsResult = {
  created: number;
  skippedDuplicates: number;
  setId: string;
};

export async function importCardsToSet(
  setId: string,
  drafts: CardDraft[],
): Promise<ImportCardsResult> {
  const studySet = await db.studySets.get(setId);
  if (!studySet) {
    throw new Error('Набор не найден');
  }

  const existingLinks = await db.setCards.where('setId').equals(setId).toArray();
  const existingCardIds = existingLinks.map((l) => l.cardId);
  const existingCards = existingCardIds.length
    ? await db.cards.bulkGet(existingCardIds)
    : [];
  const existingTerms = new Set(
    existingCards
      .filter((c): c is NonNullable<typeof c> => c != null)
      .map((c) => c.term.trim().toLowerCase()),
  );

  let position =
    existingLinks.reduce((max, l) => Math.max(max, l.position), -1) + 1;
  let created = 0;
  let skippedDuplicates = 0;
  const now = Date.now();

  await db.transaction('rw', db.studySets, db.cards, db.setCards, async () => {
    for (const draft of drafts) {
      const key = draft.term.trim().toLowerCase();
      if (existingTerms.has(key)) {
        skippedDuplicates += 1;
        continue;
      }

      const card = {
        id: createId(),
        term: draft.term.trim(),
        definition: draft.definition.trim(),
        notes: draft.notes?.trim() ?? '',
        createdAt: now,
        updatedAt: now,
      };

      await db.cards.add(card);
      await db.setCards.add({
        setId,
        cardId: card.id,
        position,
      });
      position += 1;
      created += 1;
      existingTerms.add(key);
    }

    await db.studySets.update(setId, { updatedAt: now });
  });

  return { created, skippedDuplicates, setId };
}

export async function importCardsToNewSet(
  title: string,
  description: string,
  drafts: CardDraft[],
): Promise<ImportCardsResult> {
  const studySet = await createStudySet({ title, description });
  const result = await importCardsToSet(studySet.id, drafts);
  return result;
}

export async function countCardsInSet(setId: string): Promise<number> {
  return db.setCards.where('setId').equals(setId).count();
}

export async function updateStudySet(
  id: string,
  input: { title: string; description?: string },
): Promise<StudySet> {
  const existing = await db.studySets.get(id);
  if (!existing) {
    throw new Error('Набор не найден');
  }
  const title = input.title.trim();
  if (!title) {
    throw new Error('Название не может быть пустым');
  }
  const updated: StudySet = {
    ...existing,
    title,
    description: input.description?.trim() ?? '',
    updatedAt: Date.now(),
  };
  await db.studySets.put(updated);
  return updated;
}

export async function deleteStudySet(id: string): Promise<void> {
  const existing = await db.studySets.get(id);
  if (!existing) {
    throw new Error('Набор не найден');
  }

  const links = await db.setCards.where('setId').equals(id).toArray();
  const cardIds = links.map((l) => l.cardId);

  await db.transaction('rw', db.studySets, db.setCards, db.cards, async () => {
    await db.setCards.where('setId').equals(id).delete();
    await db.studySets.delete(id);

    for (const cardId of cardIds) {
      const remaining = await db.setCards.where('cardId').equals(cardId).count();
      if (remaining === 0) {
        await db.cards.delete(cardId);
      }
    }
  });
}
