import { useCallback, useEffect } from 'react';
import styled from 'styled-components';

import type { SetCardRow } from '@/entities/card/api/cardApi';
import { useSaveCardFlashcardRatingMutation } from '@/entities/card-rating/api/queries';
import { useFlashcardsSession } from '@/features/flashcards/lib/useFlashcardsSession';
import type { FlashcardRating } from '@/features/flashcards/model/types';
import { FlashcardFlipCard } from '@/features/flashcards/ui/FlashcardFlipCard';
import { FlashcardsComplete } from '@/features/flashcards/ui/FlashcardsComplete';
import { Button } from '@/shared/ui/Button';

type FlashcardsSessionProps = {
  setId: string;
  setTitle: string;
  cards: SetCardRow[];
};

const Header = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
`;

const TitleBlock = styled.div``;

const SetTitle = styled.h1`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
`;

const Progress = styled.p`
  margin: 4px 0 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Center = styled.div`
  margin: 8px 0 28px;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 560px;
  margin: 0 auto;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
`;

const KeyboardHint = styled.p`
  margin: 20px 0 0;
  text-align: center;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Empty = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
`;

function directionLabel(
  direction: 'term-to-definition' | 'definition-to-term',
): string {
  return direction === 'term-to-definition'
    ? 'Термин → перевод'
    : 'Перевод → термин';
}

export function FlashcardsSession({
  setId,
  setTitle,
  cards,
}: FlashcardsSessionProps) {
  const session = useFlashcardsSession({ cards });
  const saveRating = useSaveCardFlashcardRatingMutation();

  const {
    direction,
    flipped,
    phase,
    currentCard,
    stats,
    progressLabel,
    isDifficult,
    toggleFlip,
    goPrev,
    goNext,
    rateCard,
    shuffleDeck,
    toggleDirection,
    toggleDifficult,
    restartWithWrong,
    resetSession,
    deck,
  } = session;

  const handleRate = useCallback(
    (rating: FlashcardRating) => {
      const cardId = currentCard?.id;
      rateCard(rating);
      if (cardId) {
        void saveRating.mutateAsync({ cardId, rating });
      }
    },
    [currentCard?.id, rateCard, saveRating],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (phase === 'complete') return;
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')
      ) {
        return;
      }

      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault();
          toggleFlip();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goPrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goNext();
          break;
        case '1':
          e.preventDefault();
          handleRate('dont-know');
          break;
        case '2':
          e.preventDefault();
          handleRate('know');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev, handleRate, phase, toggleFlip]);

  if (cards.length === 0) {
    return <Empty>В наборе нет карточек. Добавьте слова в библиотеке.</Empty>;
  }

  if (phase === 'complete') {
    return (
      <FlashcardsComplete
        setId={setId}
        setTitle={setTitle}
        stats={stats}
        hasWrongCards={stats.dontKnowCount > 0}
        onRepeatWrong={restartWithWrong}
        onStudyAgain={resetSession}
      />
    );
  }

  if (!currentCard) {
    return <Empty>Нет карточек для показа.</Empty>;
  }

  return (
    <>
      <Header>
        <TitleBlock>
          <SetTitle>{setTitle}</SetTitle>
          <Progress>Прогресс: {progressLabel}</Progress>
        </TitleBlock>
        <Toolbar>
          <Button variant="secondary" onClick={toggleDirection}>
            {directionLabel(direction)}
          </Button>
          <Button variant="ghost" onClick={shuffleDeck}>
            Перемешать
          </Button>
        </Toolbar>
      </Header>

      <Center>
        <FlashcardFlipCard
          card={currentCard}
          direction={direction}
          flipped={flipped}
          isDifficult={isDifficult}
          onFlip={toggleFlip}
          onToggleDifficult={toggleDifficult}
        />
      </Center>

      <Controls>
        <Row>
          <Button
            variant="secondary"
            onClick={goPrev}
            disabled={session.index === 0}
          >
            ← Предыдущая
          </Button>
          <Button
            variant="secondary"
            onClick={goNext}
            disabled={session.index >= deck.length - 1}
          >
            Следующая →
          </Button>
        </Row>
        <Row>
          <Button variant="secondary" onClick={() => handleRate('dont-know')}>
            Не знаю
          </Button>
          <Button onClick={() => handleRate('know')}>Знаю</Button>
        </Row>
      </Controls>

      <KeyboardHint>
        Пробел — перевернуть · ← → — навигация · 1 — не знаю · 2 — знаю
      </KeyboardHint>
    </>
  );
}
