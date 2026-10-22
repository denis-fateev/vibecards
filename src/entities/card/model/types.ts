export type Card = {
  id: string;
  term: string;
  definition: string;
  notes: string;
  createdAt: number;
  updatedAt: number;
};

export type CardDraft = {
  term: string;
  definition: string;
  notes?: string;
};
