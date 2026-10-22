import { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import {
  buildDefinitionChoices,
  buildTermChoices,
} from '@/features/learn/lib/buildMultipleChoice';
import { LEARN_CORRECT_HIGHLIGHT_MS } from '@/features/learn/lib/feedbackTiming';
import type { LearnCard } from '@/features/learn/model/types';
import {
  learnCorrectBg,
  learnCorrectBorder,
  learnCorrectHighlight,
  learnWrongBg,
  learnWrongBorder,
  learnWrongHighlight,
} from '@/features/learn/ui/learnAnswerStyles';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';

type LearnMultipleChoiceStageProps = {
  stage: 'stage2' | 'stage3';
  card: LearnCard;
  deck: LearnCard[];
  turnKey: number;
  onAnswer: (isCorrect: boolean) => void;
};

type OptionVisual = 'default' | 'correct' | 'wrong';

const Prompt = styled.p`
  margin: 0 0 20px;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.4;
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Option = styled.button<{ $visual: OptionVisual }>`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  font-size: 0.9375rem;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.accent};
    background: ${({ theme }) => theme.colors.accentMuted};
  }

  &:disabled {
    cursor: default;
    opacity: 1;
  }

  ${({ $visual }) => $visual === 'correct' && learnCorrectHighlight}
  ${({ $visual }) => $visual === 'wrong' && learnWrongHighlight}

  &:disabled:hover {
    border-color: ${({ $visual, theme }) =>
      $visual === 'correct'
        ? learnCorrectBorder
        : $visual === 'wrong'
          ? learnWrongBorder
          : theme.colors.border};
    background: ${({ $visual, theme }) =>
      $visual === 'correct'
        ? learnCorrectBg
        : $visual === 'wrong'
          ? learnWrongBg
          : theme.colors.surface};
  }
`;

const ContinueRow = styled.div`
  margin-top: 16px;
`;

const StageLabel = styled.p`
  margin: 0 0 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`;

export function LearnMultipleChoiceStage({
  stage,
  card,
  deck,
  turnKey,
  onAnswer,
}: LearnMultipleChoiceStageProps) {
  const [locked, setLocked] = useState(false);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const options = useMemo(
    () =>
      stage === 'stage2'
        ? buildTermChoices(deck, card)
        : buildDefinitionChoices(deck, card),
    [stage, card.id, deck, turnKey],
  );

  const correctText =
    stage === 'stage2' ? card.term.trim() : card.definition.trim();

  const prompt = stage === 'stage2' ? card.definition : card.term;

  const stageTitle =
    stage === 'stage2' ? 'Выберите английское слово' : 'Выберите перевод';

  useEffect(() => {
    setLocked(false);
    setSelectedText(null);
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

  const handlePick = (text: string) => {
    if (locked) return;
    const isCorrect = text === correctText;
    setLocked(true);
    setSelectedText(text);

    if (!isCorrect) return;

    timeoutRef.current = setTimeout(() => {
      onAnswer(true);
    }, LEARN_CORRECT_HIGHLIGHT_MS);
  };

  const isWrongReveal =
    locked && selectedText !== null && selectedText !== correctText;

  const handleContinueAfterWrong = () => {
    if (!isWrongReveal) return;
    onAnswer(false);
  };

  const optionVisual = (text: string): OptionVisual => {
    if (!locked || selectedText === null) return 'default';
    if (text === correctText) return 'correct';
    if (text === selectedText) return 'wrong';
    return 'default';
  };

  return (
    <Card>
      <StageLabel>{stageTitle}</StageLabel>
      <Prompt>{prompt}</Prompt>
      <Options>
        {options.map((text) => (
          <Option
            key={text}
            type="button"
            disabled={locked}
            $visual={optionVisual(text)}
            onClick={() => handlePick(text)}
          >
            {text}
          </Option>
        ))}
      </Options>
      {isWrongReveal && (
        <ContinueRow>
          <Button type="button" onClick={handleContinueAfterWrong}>
            Продолжить
          </Button>
        </ContinueRow>
      )}
    </Card>
  );
}
