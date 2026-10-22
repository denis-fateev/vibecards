import Dexie, { type Table } from 'dexie';

import type { CardLearnProgress } from '@/entities/card-learn-progress/model/types';
import type { CardFlashcardRating } from '@/entities/card-rating/model/types';
import type { Card } from '@/entities/card/model/types';
import type { StudySet } from '@/entities/study-set/model/types';

export type SetCard = {
  setId: string;
  cardId: string;
  position: number;
};

class NikaDatabase extends Dexie {
  studySets!: Table<StudySet>;
  cards!: Table<Card>;
  setCards!: Table<SetCard, [string, string]>;
  cardRatings!: Table<CardFlashcardRating, string>;
  cardLearnProgress!: Table<CardLearnProgress, [string, string]>;

  constructor() {
    super('nika');
    this.version(1).stores({
      studySets: 'id, updatedAt',
      cards: 'id, updatedAt',
      setCards: '[setId+cardId], setId, cardId',
    });
    this.version(2).stores({
      studySets: 'id, updatedAt',
      cards: 'id, updatedAt',
      setCards: '[setId+cardId], setId, cardId',
      cardRatings: 'cardId, rating, ratedAt',
    });
    this.version(3).stores({
      studySets: 'id, updatedAt',
      cards: 'id, updatedAt',
      setCards: '[setId+cardId], setId, cardId',
      cardRatings: 'cardId, rating, ratedAt',
      cardLearnProgress: '[setId+cardId], setId, cardId, completedAt',
    });
  }
}

export const db = new NikaDatabase();
