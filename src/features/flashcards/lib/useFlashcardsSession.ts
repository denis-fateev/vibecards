import { useCallback, useMemo, useState } from 'react';

import { shuffleCards } from '@/features/flashcards/lib/shuffleCards';
import type {
  FlashcardDirection,
  FlashcardItem,
  FlashcardRating,
  FlashcardsSessionStats,
} from '@/features/flashcards/model/types';

type UseFlashcardsSessionOptions = {
  cards: FlashcardItem[];
  initialDirection?: FlashcardDirection;
  onlyDontKnow?: boolean;
  initialRatings?: Record<string, FlashcardRating>;
};

export function useFlashcardsSession({
  cards,
  initialDirection = 'term-to-definition',
  onlyDontKnow = false,
  initialRatings = {},
}: UseFlashcardsSessionOptions) {
  const [direction, setDirection] = useState<FlashcardDirection>(initialDirection);
  const [deck, setDeck] = useState<FlashcardItem[]>(() => {
    if (!onlyDontKnow) return [...cards];
    const ids = new Set(
      Object.entries(initialRatings)
        .filter(([, r]) => r === 'dont-know')
        .map(([id]) => id),
    );
    return cards.filter((c) => ids.has(c.id));
  });
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [ratings, setRatings] =
    useState<Record<string, FlashcardRating>>(initialRatings);
  const [difficultIds, setDifficultIds] = useState<Set<string>>(new Set());
  const [phase, setPhase] = useState<'studying' | 'complete'>(
    deck.length === 0 ? 'complete' : 'studying',
  );

  const currentCard = deck[index] ?? null;

  const stats: FlashcardsSessionStats = useMemo(() => {
    const values = Object.values(ratings);
    return {
      totalViewed: values.length,
      knowCount: values.filter((r) => r === 'know').length,
      dontKnowCount: values.filter((r) => r === 'dont-know').length,
    };
  }, [ratings]);

  const progressLabel = deck.length === 0
    ? '0 / 0'
    : `${Math.min(index + 1, deck.length)} / ${deck.length}`;

  const toggleFlip = useCallback(() => {
    if (!currentCard || phase === 'complete') return;
    setFlipped((f) => !f);
  }, [currentCard, phase]);

  const goPrev = useCallback(() => {
    if (phase === 'complete') return;
    setIndex((i) => Math.max(0, i - 1));
    setFlipped(false);
  }, [phase]);

  const goNext = useCallback(() => {
    if (phase === 'complete') return;
    setIndex((i) => {
      const next = Math.min(deck.length - 1, i + 1);
      return next;
    });
    setFlipped(false);
  }, [deck.length, phase]);

  const rateCard = useCallback(
    (rating: FlashcardRating) => {
      if (!currentCard || phase === 'complete') return;
      setRatings((prev) => ({ ...prev, [currentCard.id]: rating }));
      const nextIndex = index + 1;
      if (nextIndex >= deck.length) {
        setPhase('complete');
        return;
      }
      setIndex(nextIndex);
      setFlipped(false);
    },
    [currentCard, deck.length, index, phase],
  );

  const shuffleDeck = useCallback(() => {
    setDeck((d) => shuffleCards(d));
    setIndex(0);
    setFlipped(false);
    setPhase('studying');
  }, []);

  const toggleDirection = useCallback(() => {
    setDirection((d) =>
      d === 'term-to-definition' ? 'definition-to-term' : 'term-to-definition',
    );
    setFlipped(false);
  }, []);

  const toggleDifficult = useCallback(() => {
    if (!currentCard) return;
    setDifficultIds((prev) => {
      const next = new Set(prev);
      if (next.has(currentCard.id)) {
        next.delete(currentCard.id);
      } else {
        next.add(currentCard.id);
      }
      return next;
    });
  }, [currentCard]);

  const isDifficult = currentCard ? difficultIds.has(currentCard.id) : false;

  const restartWithWrong = useCallback(() => {
    const wrongIds = new Set(
      Object.entries(ratings)
        .filter(([, r]) => r === 'dont-know')
        .map(([id]) => id),
    );
    const filtered = cards.filter((c) => wrongIds.has(c.id));
    setDeck(filtered);
    setIndex(0);
    setFlipped(false);
    setRatings({});
    setPhase(filtered.length === 0 ? 'complete' : 'studying');
  }, [cards, ratings]);

  const resetSession = useCallback(() => {
    setDeck([...cards]);
    setIndex(0);
    setFlipped(false);
    setRatings({});
    setDifficultIds(new Set());
    setPhase(cards.length === 0 ? 'complete' : 'studying');
  }, [cards]);

  return {
    direction,
    deck,
    index,
    flipped,
    ratings,
    phase,
    currentCard,
    stats,
    progressLabel,
    isDifficult,
    toggleFlip,
    goPrev,
    goNext,
    rateCard,
    shuffleDeck,
    toggleDirection,
    toggleDifficult,
    restartWithWrong,
    resetSession,
  };
}
