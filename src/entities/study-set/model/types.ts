export type StudySet = {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  updatedAt: number;
};

export type StudySetSummary = StudySet & {
  cardCount: number;
};
