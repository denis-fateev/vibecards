import type { ImportDelimiter } from '@/features/parse-import/model/types';

export function delimiterChar(
  delimiter: ImportDelimiter,
  custom?: string,
): string {
  switch (delimiter) {
    case 'tab':
      return '\t';
    case 'semicolon':
      return ';';
    case 'comma':
      return ',';
    case 'custom':
      return custom?.slice(0, 1) ?? '\t';
  }
}

export function detectDelimiterFromFilename(filename: string): ImportDelimiter {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.tsv')) return 'tab';
  if (lower.endsWith('.csv')) return 'comma';
  return 'tab';
}

export function detectDelimiterFromText(text: string): ImportDelimiter {
  const sample = text.split(/\r?\n/).slice(0, 5).join('\n');
  const tab = (sample.match(/\t/g) ?? []).length;
  const semi = (sample.match(/;/g) ?? []).length;
  const comma = (sample.match(/,/g) ?? []).length;
  if (tab >= semi && tab >= comma && tab > 0) return 'tab';
  if (semi >= comma && semi > 0) return 'semicolon';
  if (comma > 0) return 'comma';
  return 'tab';
}
