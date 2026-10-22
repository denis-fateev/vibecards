export type ImportDelimiter = 'tab' | 'semicolon' | 'comma' | 'custom';

export type ParsedImportRow = {
  lineNumber: number;
  term: string;
  definition: string;
};

export type ImportRowIssue = {
  lineNumber: number;
  message: string;
  raw: string;
};

export type ParseImportResult = {
  rows: ParsedImportRow[];
  issues: ImportRowIssue[];
  duplicateKeys: string[];
};
