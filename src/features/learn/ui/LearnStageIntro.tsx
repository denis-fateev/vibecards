import { useEffect } from 'react';
import styled from 'styled-components';

import type { LearnCard } from '@/features/learn/model/types';
import {
  isSpeechSynthesisSupported,
  speakEnglish,
} from '@/shared/lib/speakEnglish';
import { Card } from '@/shared/ui/Card';

const speechAvailable = isSpeechSynthesisSupported();

type LearnStageIntroProps = {
  card: LearnCard;
  index: number;
  total: number;
  onContinue: () => void;
};

const Inner = styled.div`
  position: relative;
`;

const SpeakButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 6px 10px;
  font-size: 1.125rem;
  line-height: 1;
  cursor: pointer;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const Counter = styled.p`
  margin: 0 0 16px;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`;

const Clickable = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: inherit;
`;

const Term = styled.p`
  margin: 0 0 16px;
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
`;

const Definition = styled.p`
  margin: 0;
  font-size: 1.125rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Hint = styled.p`
  margin: 16px 0 0;
  font-size: 0.8125rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function LearnStageIntro({
  card,
  index,
  total,
  onContinue,
}: LearnStageIntroProps) {
  useEffect(() => {
    speakEnglish(card.term);
  }, [card.id, card.term]);

  return (
    <Card>
      <Inner>
        {speechAvailable ? (
          <SpeakButton
            type="button"
            aria-label="Прослушать произношение"
            onClick={(e) => {
              e.stopPropagation();
              speakEnglish(card.term);
            }}
          >
            🔊
          </SpeakButton>
        ) : null}
        <Counter>
          Знакомство · {index + 1} / {total}
        </Counter>
        <Clickable type="button" onClick={onContinue}>
          <Term>{card.term}</Term>
          <Definition>{card.definition}</Definition>
        </Clickable>
        <Hint>Нажмите на карточку, чтобы перейти к следующей</Hint>
      </Inner>
    </Card>
  );
}
