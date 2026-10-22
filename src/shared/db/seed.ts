import { importCardsToNewSet } from '@/entities/study-set/api/studySetApi';
import { detectDelimiterFromText } from '@/features/parse-import/lib/delimiter';
import { parseImportText } from '@/features/parse-import/lib/parseImport';
import { db } from '@/shared/db/db';

import animalsBasic from '@/shared/data/animals-basic.tsv?raw';
import c2Vocabulary from '@/shared/data/c2-vocabulary.tsv?raw';

type SeedSetDefinition = {
  title: string;
  description: string;
  tsv: string;
};

const SEED_SETS: SeedSetDefinition[] = [
  {
    title: 'C2 Vocabulary',
    description:
      '40 интересных английских слов уровня C2 с переводом на русский',
    tsv: c2Vocabulary,
  },
  {
    title: 'Animals',
    description: 'Три простых слова: dog, cat, duck',
    tsv: animalsBasic,
  },
];

async function ensureSeedSet(def: SeedSetDefinition): Promise<void> {
  const existing = await db.studySets
    .filter((set) => set.title === def.title)
    .first();
  if (existing) return;

  const delimiter = detectDelimiterFromText(def.tsv);
  const { rows, issues } = parseImportText(def.tsv, delimiter);
  if (issues.length > 0) {
    console.warn(`Seed import issues (${def.title})`, issues);
  }

  await importCardsToNewSet(
    def.title,
    def.description,
    rows.map((r) => ({ term: r.term, definition: r.definition })),
  );
}

export async function seedDatabaseIfEmpty(): Promise<void> {
  for (const def of SEED_SETS) {
    await ensureSeedSet(def);
  }
}
