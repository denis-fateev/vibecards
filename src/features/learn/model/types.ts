import type { SetCardRow } from '@/entities/card/api/cardApi';

export type LearnCard = Pick<SetCardRow, 'id' | 'term' | 'definition'>;

export const LEARN_SESSION_TARGET = 10;

export type LearnSessionPhase =
  | 'picking'
  | 'stage1'
  | 'stage2'
  | 'stage3'
  | 'stage4'
  | 'complete';

export type LearnStageId = 'stage1' | 'stage2' | 'stage3' | 'stage4';

export type WrittenAnswerResult =
  | { kind: 'correct' }
  | { kind: 'typo' }
  | { kind: 'wrong' };

export type LearnSessionSummary = {
  errorCounts: Record<string, number>;
  selectedCards: LearnCard[];
};
