function shuffleIds(ids: string[]): string[] {
  const copy = [...ids];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export type StageQueueState = {
  queue: string[];
  retryQueue: string[];
  index: number;
};

export function createStageQueue(cardIds: string[]): StageQueueState {
  return {
    queue: shuffleIds(cardIds),
    retryQueue: [],
    index: 0,
  };
}

export type StageQueueAdvance =
  | { type: 'next'; state: StageQueueState }
  | { type: 'stage-complete' };

function flushRetries(state: StageQueueState): StageQueueState | null {
  if (state.retryQueue.length === 0) return null;
  return {
    queue: shuffleIds(state.retryQueue),
    retryQueue: [],
    index: 0,
  };
}

function advanceIndex(state: StageQueueState): StageQueueAdvance {
  const nextIndex = state.index + 1;
  if (nextIndex < state.queue.length) {
    return {
      type: 'next',
      state: { ...state, index: nextIndex },
    };
  }

  const afterRetry = flushRetries(state);
  if (afterRetry) {
    return { type: 'next', state: afterRetry };
  }

  return { type: 'stage-complete' };
}

export function advanceStageQueueCorrect(
  state: StageQueueState,
): StageQueueAdvance {
  return advanceIndex(state);
}

export function advanceStageQueueWrong(
  state: StageQueueState,
  cardId: string,
): StageQueueAdvance {
  const withRetry: StageQueueState = {
    ...state,
    retryQueue: [...state.retryQueue, cardId],
  };
  return advanceIndex(withRetry);
}

export function getCurrentCardId(state: StageQueueState): string | null {
  return state.queue[state.index] ?? null;
}
