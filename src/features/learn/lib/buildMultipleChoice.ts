import type { LearnCard } from '@/features/learn/model/types';

function shuffleInPlace<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

export function buildTermChoices(
  deck: LearnCard[],
  correctCard: LearnCard,
): string[] {
  const wrongPool = deck
    .filter((c) => c.id !== correctCard.id)
    .map((c) => c.term.trim())
    .filter((t, i, arr) => t && arr.indexOf(t) === i);

  const wrong = shuffleInPlace([...wrongPool]).slice(0, 3);
  const options = shuffleInPlace([correctCard.term.trim(), ...wrong]);

  while (options.length < Math.min(4, deck.length)) {
    const extra = wrongPool.find((t) => !options.includes(t));
    if (!extra) break;
    options.push(extra);
  }

  return options.slice(0, Math.min(4, deck.length));
}

export function buildDefinitionChoices(
  deck: LearnCard[],
  correctCard: LearnCard,
): string[] {
  const wrongPool = deck
    .filter((c) => c.id !== correctCard.id)
    .map((c) => c.definition.trim())
    .filter((t, i, arr) => t && arr.indexOf(t) === i);

  const wrong = shuffleInPlace([...wrongPool]).slice(0, 3);
  const options = shuffleInPlace([
    correctCard.definition.trim(),
    ...wrong,
  ]);

  while (options.length < Math.min(4, deck.length)) {
    const extra = wrongPool.find((t) => !options.includes(t));
    if (!extra) break;
    options.push(extra);
  }

  return options.slice(0, Math.min(4, deck.length));
}
