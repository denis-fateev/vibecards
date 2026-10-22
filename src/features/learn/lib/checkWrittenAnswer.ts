import type { WrittenAnswerResult } from '@/features/learn/model/types';

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix: number[] = new Array(rows * cols);

  for (let i = 0; i < rows; i += 1) matrix[i * cols] = i;
  for (let j = 0; j < cols; j += 1) matrix[j] = j;

  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const idx = i * cols + j;
      matrix[idx] = Math.min(
        matrix[(i - 1) * cols + j] + 1,
        matrix[i * cols + (j - 1)] + 1,
        matrix[(i - 1) * cols + (j - 1)] + cost,
      );
    }
  }

  return matrix[(rows - 1) * cols + (cols - 1)];
}

export function checkWrittenAnswer(
  userInput: string,
  expected: string,
): WrittenAnswerResult {
  const normalizedUser = userInput.trim();
  const normalizedExpected = expected.trim();

  if (normalizedUser === normalizedExpected) {
    return { kind: 'correct' };
  }

  const distance = levenshtein(normalizedUser, normalizedExpected);
  if (distance === 1) {
    return { kind: 'typo' };
  }

  return { kind: 'wrong' };
}
