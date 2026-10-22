import Dexie, { type Table } from 'dexie';

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

  constructor() {
    super('nika');
    this.version(1).stores({
      studySets: 'id, updatedAt',
      cards: 'id, updatedAt',
      setCards: '[setId+cardId], setId, cardId',
    });
  }
}

export const db = new NikaDatabase();
