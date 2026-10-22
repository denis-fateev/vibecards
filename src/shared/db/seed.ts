import { importCardsToNewSet } from '@/entities/study-set/api/studySetApi';
import { detectDelimiterFromText } from '@/features/parse-import/lib/delimiter';
import { parseImportText } from '@/features/parse-import/lib/parseImport';
import { db } from '@/shared/db/db';

import c2Vocabulary from '@/shared/data/c2-vocabulary.tsv?raw';

const SEED_SET_TITLE = 'C2 Vocabulary';
const SEED_SET_DESCRIPTION =
  '40 интересных английских слов уровня C2 с переводом на русский';

export async function seedDatabaseIfEmpty(): Promise<void> {
  const count = await db.studySets.count();
  if (count > 0) return;

  const delimiter = detectDelimiterFromText(c2Vocabulary);
  const { rows, issues } = parseImportText(c2Vocabulary, delimiter);
  if (issues.length > 0) {
    console.warn('Seed import issues', issues);
  }

  await importCardsToNewSet(
    SEED_SET_TITLE,
    SEED_SET_DESCRIPTION,
    rows.map((r) => ({ term: r.term, definition: r.definition })),
  );
}
