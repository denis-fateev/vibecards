import { z } from 'zod';

import { delimiterChar } from '@/features/parse-import/lib/delimiter';
import type {
  ImportDelimiter,
  ParseImportResult,
  ParsedImportRow,
} from '@/features/parse-import/model/types';

const rowSchema = z.object({
  term: z.string().min(1, 'Пустой термин'),
  definition: z.string().min(1, 'Пустое определение'),
});

function normalizeTermKey(term: string): string {
  return term.trim().toLowerCase();
}

export function parseImportText(
  text: string,
  delimiter: ImportDelimiter,
  customDelimiter?: string,
): ParseImportResult {
  const sep = delimiterChar(delimiter, customDelimiter);
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const rows: ParsedImportRow[] = [];
  const issues: ParseImportResult['issues'] = [];
  const seen = new Map<string, number>();
  const duplicateKeys: string[] = [];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmed = line.trim();
    if (!trimmed) return;

    const parts = line.split(sep);
    if (parts.length < 2) {
      issues.push({
        lineNumber,
        message: 'Не найден разделитель между термином и определением',
        raw: line,
      });
      return;
    }

    const term = parts[0]?.trim() ?? '';
    const definition = parts.slice(1).join(sep).trim();

    const parsed = rowSchema.safeParse({ term, definition });
    if (!parsed.success) {
      issues.push({
        lineNumber,
        message: parsed.error.issues[0]?.message ?? 'Некорректная строка',
        raw: line,
      });
      return;
    }

    const key = normalizeTermKey(term);
    if (seen.has(key)) {
      duplicateKeys.push(key);
    } else {
      seen.set(key, lineNumber);
    }

    rows.push({ lineNumber, term, definition });
  });

  return { rows, issues, duplicateKeys };
}

export function parseImportFileContent(
  content: string,
  options: {
    delimiter: ImportDelimiter;
    customDelimiter?: string;
  },
): ParseImportResult {
  return parseImportText(content, options.delimiter, options.customDelimiter);
}
