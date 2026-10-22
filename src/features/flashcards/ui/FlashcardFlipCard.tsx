import styled from 'styled-components';

import type {
  FlashcardDirection,
  FlashcardItem,
} from '@/features/flashcards/model/types';

type FlashcardFlipCardProps = {
  card: FlashcardItem;
  direction: FlashcardDirection;
  flipped: boolean;
  isDifficult: boolean;
  onFlip: () => void;
  onToggleDifficult: () => void;
};

const Scene = styled.div`
  perspective: 1200px;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
`;

const FlipInner = styled.button<{ $flipped: boolean }>`
  position: relative;
  display: block;
  width: 100%;
  min-height: 220px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.45s cubic-bezier(0.4, 0.2, 0.2, 1);
  transform: ${({ $flipped }) => ($flipped ? 'rotateY(180deg)' : 'none')};

  &:focus-visible {
    outline: none;
  }

  @media (min-width: 600px) {
    min-height: 280px;
  }
`;

const Face = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 28px 24px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.card};
  backface-visibility: hidden;
  text-align: center;
`;

const BackFace = styled(Face)`
  transform: rotateY(180deg);
`;

const SideLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Content = styled.p`
  margin: 0;
  font-size: 1.25rem;
  line-height: 1.45;
  font-weight: 600;
  word-break: break-word;
  max-width: 100%;

  @media (min-width: 600px) {
    font-size: 1.5rem;
  }
`;

const Hint = styled.span`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const DifficultButton = styled.button<{ $active: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 6px 10px;
  font-size: 0.8125rem;
  cursor: pointer;
  background: ${({ theme, $active }) =>
    $active ? theme.colors.accentMuted : 'transparent'};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.accent : theme.colors.textMuted};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;

const Wrapper = styled.div`
  position: relative;
`;

function frontText(card: FlashcardItem, direction: FlashcardDirection): string {
  return direction === 'term-to-definition' ? card.term : card.definition;
}

function backText(card: FlashcardItem, direction: FlashcardDirection): string {
  return direction === 'term-to-definition' ? card.definition : card.term;
}

function frontLabel(direction: FlashcardDirection): string {
  return direction === 'term-to-definition' ? 'Термин' : 'Перевод';
}

function backLabel(direction: FlashcardDirection): string {
  return direction === 'term-to-definition' ? 'Перевод' : 'Термин';
}

export function FlashcardFlipCard({
  card,
  direction,
  flipped,
  isDifficult,
  onFlip,
  onToggleDifficult,
}: FlashcardFlipCardProps) {
  return (
    <Wrapper>
      <DifficultButton
        type="button"
        $active={isDifficult}
        aria-pressed={isDifficult}
        aria-label={isDifficult ? 'Убрать из сложных' : 'Отметить как сложную'}
        onClick={(e) => {
          e.stopPropagation();
          onToggleDifficult();
        }}
      >
        {isDifficult ? '★ Сложная' : '☆ Сложная'}
      </DifficultButton>
      <Scene>
        <FlipInner
          type="button"
          $flipped={flipped}
          onClick={onFlip}
          aria-label={flipped ? 'Скрыть ответ' : 'Показать ответ'}
        >
          <Face>
            <SideLabel>{frontLabel(direction)}</SideLabel>
            <Content>{frontText(card, direction)}</Content>
            <Hint>Нажмите, чтобы перевернуть</Hint>
          </Face>
          <BackFace>
            <SideLabel>{backLabel(direction)}</SideLabel>
            <Content>{backText(card, direction)}</Content>
            {card.notes ? (
              <Hint>{card.notes}</Hint>
            ) : (
              <Hint>Нажмите, чтобы вернуться</Hint>
            )}
          </BackFace>
        </FlipInner>
      </Scene>
    </Wrapper>
  );
}
