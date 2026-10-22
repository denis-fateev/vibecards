import { useCallback, useMemo, useState } from 'react';

import {
  advanceStageQueueCorrect,
  advanceStageQueueWrong,
  createStageQueue,
  getCurrentCardId,
  type StageQueueState,
} from '@/features/learn/lib/stageQueue';
import {
  LEARN_SESSION_TARGET,
  type LearnCard,
  type LearnSessionPhase,
  type LearnStageId,
} from '@/features/learn/model/types';

type GradedStage = 'stage2' | 'stage3' | 'stage4';

type UseLearnSessionOptions = {
  allCards: LearnCard[];
  learnedCardIds: string[];
};

function shuffleLearnCards(cards: LearnCard[]): LearnCard[] {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const STAGE_ORDER: LearnStageId[] = ['stage1', 'stage2', 'stage3', 'stage4'];

function nextPhaseAfterStage(stage: LearnStageId): LearnSessionPhase {
  const idx = STAGE_ORDER.indexOf(stage);
  if (idx < 0 || idx >= STAGE_ORDER.length - 1) return 'complete';
  return STAGE_ORDER[idx + 1];
}

function applyQueueAdvance(
  result: ReturnType<typeof advanceStageQueueCorrect>,
  onComplete: () => void,
  setQueue: (state: StageQueueState) => void,
) {
  if (result.type === 'stage-complete') {
    onComplete();
    return;
  }
  setQueue(result.state);
}

export function useLearnSession({
  allCards,
  learnedCardIds,
}: UseLearnSessionOptions) {
  const learnedSet = useMemo(
    () => new Set(learnedCardIds),
    [learnedCardIds],
  );

  const unlearnedCards = useMemo(
    () => allCards.filter((c) => !learnedSet.has(c.id)),
    [allCards, learnedSet],
  );

  const sessionTarget = Math.min(LEARN_SESSION_TARGET, unlearnedCards.length);

  const [phase, setPhase] = useState<LearnSessionPhase>(() => {
    if (unlearnedCards.length === 0) return 'complete';
    return 'picking';
  });

  const [pickQueue] = useState<LearnCard[]>(() =>
    shuffleLearnCards(unlearnedCards),
  );
  const [pickIndex, setPickIndex] = useState(0);
  const [selectedCards, setSelectedCards] = useState<LearnCard[]>([]);

  const [stage1Index, setStage1Index] = useState(0);

  const [stage2Queue, setStage2Queue] = useState<StageQueueState | null>(null);
  const [stage3Queue, setStage3Queue] = useState<StageQueueState | null>(null);
  const [stage4Queue, setStage4Queue] = useState<StageQueueState | null>(null);
  const [stage2Turn, setStage2Turn] = useState(0);
  const [stage3Turn, setStage3Turn] = useState(0);
  const [stage4Turn, setStage4Turn] = useState(0);

  const [completedStages, setCompletedStages] = useState<Set<LearnStageId>>(
    () => new Set(),
  );

  const [errorCounts, setErrorCounts] = useState<Record<string, number>>({});

  const recordError = useCallback((cardId: string) => {
    setErrorCounts((prev) => ({
      ...prev,
      [cardId]: (prev[cardId] ?? 0) + 1,
    }));
  }, []);

  const completeStage = useCallback(
    (stage: LearnStageId) => {
      setCompletedStages((prev) => new Set([...prev, stage]));
      const next = nextPhaseAfterStage(stage);
      if (next === 'complete') {
        setPhase('complete');
        return;
      }
      setPhase(next);
      const ids = selectedCards.map((c) => c.id);
      if (next === 'stage2') {
        setStage2Queue(createStageQueue(ids));
        setStage2Turn((t) => t + 1);
      }
      if (next === 'stage3') {
        setStage3Queue(createStageQueue(ids));
        setStage3Turn((t) => t + 1);
      }
      if (next === 'stage4') {
        setStage4Queue(createStageQueue(ids));
        setStage4Turn((t) => t + 1);
      }
    },
    [selectedCards],
  );

  const beginTraining = useCallback(
    (cards: LearnCard[]) => {
      setSelectedCards(cards);
      setStage1Index(0);
      setStage2Queue(null);
      setStage3Queue(null);
      setStage4Queue(null);
      setCompletedStages(new Set());
      setErrorCounts({});
      setPhase('stage1');
    },
    [],
  );

  const tryStartTraining = useCallback(
    (cards: LearnCard[]) => {
      if (cards.length > 0) beginTraining(cards);
    },
    [beginTraining],
  );

  const addCardToSession = useCallback(() => {
    const card = pickQueue[pickIndex];
    if (!card) return;

    const nextSelected = [...selectedCards, card];
    const nextPickIndex = pickIndex + 1;

    if (nextSelected.length >= sessionTarget) {
      beginTraining(nextSelected);
      return;
    }

    setSelectedCards(nextSelected);

    if (nextPickIndex >= pickQueue.length) {
      tryStartTraining(nextSelected);
      return;
    }

    setPickIndex(nextPickIndex);
  }, [
    beginTraining,
    pickIndex,
    pickQueue,
    selectedCards,
    sessionTarget,
    tryStartTraining,
  ]);

  const skipPickCard = useCallback(() => {
    const nextPickIndex = pickIndex + 1;
    if (nextPickIndex >= pickQueue.length) {
      tryStartTraining(selectedCards);
      return;
    }
    setPickIndex(nextPickIndex);
  }, [pickIndex, pickQueue.length, selectedCards, tryStartTraining]);

  const advanceStage1 = useCallback(() => {
    const next = stage1Index + 1;
    if (next >= selectedCards.length) {
      completeStage('stage1');
      return;
    }
    setStage1Index(next);
  }, [completeStage, selectedCards.length, stage1Index]);

  const getQueueForStage = useCallback(
    (stage: GradedStage): StageQueueState | null => {
      if (stage === 'stage2') return stage2Queue;
      if (stage === 'stage3') return stage3Queue;
      return stage4Queue;
    },
    [stage2Queue, stage3Queue, stage4Queue],
  );

  const setQueueForStage = useCallback(
    (stage: GradedStage, state: StageQueueState) => {
      if (stage === 'stage2') {
        setStage2Queue(state);
        setStage2Turn((t) => t + 1);
      } else if (stage === 'stage3') {
        setStage3Queue(state);
        setStage3Turn((t) => t + 1);
      } else {
        setStage4Queue(state);
        setStage4Turn((t) => t + 1);
      }
    },
    [],
  );

  const advanceQueueAfterCorrect = useCallback(
    (stage: GradedStage) => {
      const queue = getQueueForStage(stage);
      if (!queue) return;
      applyQueueAdvance(
        advanceStageQueueCorrect(queue),
        () => completeStage(stage),
        (state) => setQueueForStage(stage, state),
      );
    },
    [completeStage, getQueueForStage, setQueueForStage],
  );

  const advanceQueueAfterWrong = useCallback(
    (stage: GradedStage, cardId: string) => {
      const queue = getQueueForStage(stage);
      if (!queue) return;
      applyQueueAdvance(
        advanceStageQueueWrong(queue, cardId),
        () => completeStage(stage),
        (state) => setQueueForStage(stage, state),
      );
    },
    [completeStage, getQueueForStage, setQueueForStage],
  );

  const answerMultipleChoice = useCallback(
    (stage: 'stage2' | 'stage3', cardId: string, isCorrect: boolean) => {
      if (isCorrect) {
        advanceQueueAfterCorrect(stage);
        return;
      }

      recordError(cardId);
      advanceQueueAfterWrong(stage, cardId);
    },
    [advanceQueueAfterCorrect, advanceQueueAfterWrong, recordError],
  );

  const answerWritten = useCallback(
    (
      cardId: string,
      result: 'correct' | 'typo' | 'wrong',
      _correctAnswer: string,
    ) => {
      if (result === 'correct' || result === 'typo') {
        advanceQueueAfterCorrect('stage4');
        return;
      }

      recordError(cardId);
      advanceQueueAfterWrong('stage4', cardId);
    },
    [advanceQueueAfterCorrect, advanceQueueAfterWrong, recordError],
  );

  const pickingCard = pickQueue[pickIndex] ?? null;
  const stage1Card = selectedCards[stage1Index] ?? null;

  const stage2CardId = stage2Queue ? getCurrentCardId(stage2Queue) : null;
  const stage3CardId = stage3Queue ? getCurrentCardId(stage3Queue) : null;
  const stage4CardId = stage4Queue ? getCurrentCardId(stage4Queue) : null;

  const cardById = useMemo(() => {
    const map = new Map<string, LearnCard>();
    for (const c of selectedCards) map.set(c.id, c);
    return map;
  }, [selectedCards]);

  return {
    phase,
    sessionTarget,
    unlearnedCount: unlearnedCards.length,
    allLearned: unlearnedCards.length === 0 && allCards.length > 0,
    pickingCard,
    selectedCount: selectedCards.length,
    selectedCards,
    addCardToSession,
    skipPickCard,
    stage1Card,
    stage1Index,
    stage1Total: selectedCards.length,
    advanceStage1,
    stage2Card: stage2CardId ? cardById.get(stage2CardId) ?? null : null,
    stage3Card: stage3CardId ? cardById.get(stage3CardId) ?? null : null,
    stage4Card: stage4CardId ? cardById.get(stage4CardId) ?? null : null,
    stage2Turn,
    stage3Turn,
    stage4Turn,
    answerMultipleChoice,
    answerWritten,
    completedStages,
    errorCounts,
    deck: selectedCards,
  };
}
