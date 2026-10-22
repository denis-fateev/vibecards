import type { ChangeEvent } from 'react';
import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import { useImportCardsMutation } from '@/entities/study-set/api/queries';
import type { StudySetSummary } from '@/entities/study-set/model/types';
import {
  detectDelimiterFromFilename,
  detectDelimiterFromText,
  delimiterChar,
} from '@/features/parse-import/lib/delimiter';
import { parseImportText } from '@/features/parse-import/lib/parseImport';
import type { ImportDelimiter } from '@/features/parse-import/model/types';
import { Button } from '@/shared/ui/Button';

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
  flex: 1;
  min-width: 160px;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 8px 10px;
  font-size: 0.875rem;
`;

const Select = styled.select`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 8px 10px;
  font-size: 0.875rem;
  background: ${({ theme }) => theme.colors.surface};
`;

const TextArea = styled.textarea`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 10px 12px;
  font-size: 0.8125rem;
  font-family: ui-monospace, monospace;
  min-height: 140px;
  resize: vertical;
  width: 100%;
`;

const Hint = styled.p`
  margin: 0;
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ErrorList = styled.ul`
  margin: 0;
  padding-left: 18px;
  font-size: 0.8125rem;
  color: #b42318;
`;

const PreviewTable = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: auto;
  max-height: 220px;
`;

const PreviewRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  gap: 12px;
  padding: 8px 12px;
  font-size: 0.8125rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }

  & > span:first-child {
    font-weight: 500;
  }
`;

const Status = styled.p<{ $variant?: 'success' | 'error' }>`
  margin: 0;
  font-size: 0.875rem;
  color: ${({ theme, $variant }) =>
    $variant === 'error' ? '#b42318' : $variant === 'success' ? '#067647' : theme.colors.textMuted};
`;

type ImportCardsPanelProps = {
  sets: StudySetSummary[];
  onImported?: () => void;
};

export function ImportCardsPanel({ sets, onImported }: ImportCardsPanelProps) {
  const [rawText, setRawText] = useState('');
  const [delimiter, setDelimiter] = useState<ImportDelimiter>('tab');
  const [customDelimiter, setCustomDelimiter] = useState('|');
  const [targetMode, setTargetMode] = useState<'new' | 'existing'>('new');
  const [newTitle, setNewTitle] = useState('');
  const [existingSetId, setExistingSetId] = useState('');
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const importMutation = useImportCardsMutation();

  const parseResult = useMemo(
    () => parseImportText(rawText, delimiter, customDelimiter),
    [rawText, delimiter, customDelimiter],
  );

  const previewRows = parseResult.rows.slice(0, 8);

  const loadFile = useCallback(async (file: File) => {
    const text = await file.text();
    setRawText(text);
    setDelimiter(detectDelimiterFromFilename(file.name));
    const detected = detectDelimiterFromText(text);
    setDelimiter(detected);
    setImportMessage(null);
  }, []);

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void loadFile(file);
    event.target.value = '';
  };

  const canImport =
    parseResult.rows.length > 0 &&
    parseResult.issues.length === 0 &&
    (targetMode === 'new' ? newTitle.trim().length > 0 : existingSetId.length > 0);

  const handleImport = async () => {
    setImportMessage(null);
    if (parseResult.issues.length > 0) {
      setImportMessage('Исправьте ошибки в данных перед импортом.');
      return;
    }
    if (parseResult.rows.length === 0) {
      setImportMessage('Нет карточек для импорта.');
      return;
    }

    try {
      const result = await importMutation.mutateAsync({
        mode: targetMode,
        setId: targetMode === 'existing' ? existingSetId : undefined,
        title: targetMode === 'new' ? newTitle : undefined,
        cards: parseResult.rows.map((r) => ({
          term: r.term,
          definition: r.definition,
        })),
      });
      setImportMessage(
        `Импортировано ${result.created} карточек` +
          (result.skippedDuplicates > 0
            ? `, пропущено дубликатов: ${result.skippedDuplicates}`
            : '') +
          '.',
      );
      if (targetMode === 'new') {
        setNewTitle('');
        setRawText('');
      }
      onImported?.();
    } catch (err) {
      setImportMessage(
        err instanceof Error ? err.message : 'Не удалось выполнить импорт',
      );
    }
  };

  return (
    <Panel>
      <Hint>
        Формат: термин и определение в одной строке, разделённые табуляцией или
        выбранным символом. Поддерживаются файлы CSV и TSV.
      </Hint>

      <Row>
        <Label>
          Файл (CSV / TSV)
          <Input type="file" accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values" onChange={onFileChange} />
        </Label>
      </Row>

      <Row>
        <Label>
          Разделитель
          <Select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value as ImportDelimiter)}
          >
            <option value="tab">Табуляция</option>
            <option value="semicolon">Точка с запятой</option>
            <option value="comma">Запятая</option>
            <option value="custom">Свой символ</option>
          </Select>
        </Label>
        {delimiter === 'custom' && (
          <Label>
            Символ
            <Input
              value={customDelimiter}
              maxLength={1}
              onChange={(e) => setCustomDelimiter(e.target.value)}
            />
          </Label>
        )}
      </Row>

      <Label>
        Текст для импорта
        <TextArea
          value={rawText}
          onChange={(e) => {
            setRawText(e.target.value);
            setImportMessage(null);
          }}
          placeholder={`ubiquity${delimiterChar(delimiter, customDelimiter)}повсеместность`}
          spellCheck={false}
        />
      </Label>

      <Row>
        <Status>
          Найдено карточек: <strong>{parseResult.rows.length}</strong>
          {parseResult.duplicateKeys.length > 0 && (
            <> · дубликатов в файле: {parseResult.duplicateKeys.length}</>
          )}
        </Status>
      </Row>

      {parseResult.issues.length > 0 && (
        <ErrorList>
          {parseResult.issues.slice(0, 6).map((issue) => (
            <li key={`${issue.lineNumber}-${issue.message}`}>
              Строка {issue.lineNumber}: {issue.message}
            </li>
          ))}
          {parseResult.issues.length > 6 && (
            <li>…и ещё {parseResult.issues.length - 6} ошибок</li>
          )}
        </ErrorList>
      )}

      {previewRows.length > 0 && (
        <PreviewTable>
          {previewRows.map((row) => (
            <PreviewRow key={row.lineNumber}>
              <span>{row.term}</span>
              <span>{row.definition}</span>
            </PreviewRow>
          ))}
          {parseResult.rows.length > previewRows.length && (
            <PreviewRow>
              <span>…</span>
              <span>ещё {parseResult.rows.length - previewRows.length} строк</span>
            </PreviewRow>
          )}
        </PreviewTable>
      )}

      <Row>
        <Label>
          Куда импортировать
          <Select
            value={targetMode}
            onChange={(e) => setTargetMode(e.target.value as 'new' | 'existing')}
          >
            <option value="new">Новый набор</option>
            <option value="existing">Существующий набор</option>
          </Select>
        </Label>
      </Row>

      {targetMode === 'new' ? (
        <Label>
          Название набора
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="English Vocabulary"
          />
        </Label>
      ) : (
        <Label>
          Набор
          <Select
            value={existingSetId}
            onChange={(e) => setExistingSetId(e.target.value)}
          >
            <option value="">Выберите набор</option>
            {sets.map((set) => (
              <option key={set.id} value={set.id}>
                {set.title} ({set.cardCount})
              </option>
            ))}
          </Select>
        </Label>
      )}

      <Row>
        <Button
          onClick={() => void handleImport()}
          disabled={!canImport || importMutation.isPending}
        >
          {importMutation.isPending ? 'Импорт…' : 'Импортировать'}
        </Button>
      </Row>

      {importMessage && (
        <Status
          $variant={importMessage.startsWith('Импортировано') ? 'success' : 'error'}
        >
          {importMessage}
        </Status>
      )}
    </Panel>
  );
}
