import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { checkWrittenAnswer } from '@/features/learn/lib/checkWrittenAnswer';
import { LEARN_CORRECT_HIGHLIGHT_MS } from '@/features/learn/lib/feedbackTiming';
import type { LearnCard } from '@/features/learn/model/types';
import {
  learnCorrectHighlight,
  learnCorrectTextHighlight,
  learnWrongHighlight,
  learnWrongTextHighlight,
} from '@/features/learn/ui/learnAnswerStyles';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';

type LearnWrittenStageProps = {
  card: LearnCard;
  turnKey: number;
  onSubmit: (
    result: 'correct' | 'typo' | 'wrong',
    correctAnswer: string,
  ) => void;
};

type RevealKind = 'idle' | 'correct' | 'typo' | 'wrong';

const StageLabel = styled.p`
  margin: 0 0 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`;

const Term = styled.p`
  margin: 0 0 20px;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
`;

const Input = styled.input<{ $reveal: RevealKind }>`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 1rem;
  margin-bottom: 12px;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;

  ${({ $reveal }) =>
    ($reveal === 'correct' || $reveal === 'typo') && learnCorrectHighlight}
  ${({ $reveal }) => $reveal === 'wrong' && learnWrongHighlight}
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const CompareRow = styled.p`
  margin: 0 0 12px;
  font-size: 1rem;
  text-align: center;
  line-height: 1.5;
`;

const CompareSep = styled.span`
  margin: 0 0.35em;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const UserAnswer = styled.span<{ $typo?: boolean }>`
  ${learnWrongTextHighlight}
  ${({ $typo }) =>
    $typo &&
    `
    text-decoration: none;
    color: #b54708;
  `}
`;

const ExpectedAnswer = styled.span`
  ${learnCorrectTextHighlight}
`;

export function LearnWrittenStage({
  card,
  turnKey,
  onSubmit,
}: LearnWrittenStageProps) {
  const [value, setValue] = useState('');
  const [reveal, setReveal] = useState<RevealKind>('idle');
  const [submittedText, setSubmittedText] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setValue('');
    setReveal('idle');
    setSubmittedText('');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [card.id, turnKey]);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reveal !== 'idle') return;
    const trimmed = value.trim();
    if (!trimmed) return;

    setSubmittedText(trimmed);
    const checked = checkWrittenAnswer(trimmed, card.definition);
    if (checked.kind === 'correct') {
      setReveal('correct');
      timeoutRef.current = setTimeout(() => {
        onSubmit('correct', card.definition);
      }, LEARN_CORRECT_HIGHLIGHT_MS);
      return;
    }
    if (checked.kind === 'typo') {
      setReveal('typo');
      return;
    }
    setReveal('wrong');
  };

  const awaitingContinue = reveal === 'typo' || reveal === 'wrong';

  const handleContinue = () => {
    if (reveal === 'typo') {
      onSubmit('typo', card.definition);
      return;
    }
    if (reveal === 'wrong') {
      onSubmit('wrong', card.definition);
    }
  };

  const showCompare = awaitingContinue;

  return (
    <Card>
      <StageLabel>Введите перевод</StageLabel>
      <Term lang="en">{card.term}</Term>
      <Form onSubmit={handleSubmit}>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={reveal !== 'idle'}
          $reveal={reveal}
          placeholder="Ваш ответ"
          autoComplete="off"
          autoFocus
        />
        {showCompare && (
          <CompareRow>
            <UserAnswer $typo={reveal === 'typo'}>{submittedText}</UserAnswer>
            <CompareSep>→</CompareSep>
            <ExpectedAnswer>{card.definition.trim()}</ExpectedAnswer>
          </CompareRow>
        )}
        {awaitingContinue ? (
          <Button type="button" onClick={handleContinue}>
            Продолжить
          </Button>
        ) : (
          <Button type="submit" disabled={reveal !== 'idle' || !value.trim()}>
            Проверить
          </Button>
        )}
      </Form>
    </Card>
  );
}
