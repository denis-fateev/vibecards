import type { FlashcardItem } from '@/features/flashcards/model/types';

export function shuffleCards(cards: FlashcardItem[]): FlashcardItem[] {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
