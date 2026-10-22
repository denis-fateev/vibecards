import { useEffect, useRef } from 'react';
import styled from 'styled-components';

import type { SetCardRow } from '@/entities/card/api/cardApi';
import { useMarkCardsLearnedMutation } from '@/entities/card-learn-progress/api/queries';
import { useLearnSession } from '@/features/learn/lib/useLearnSession';
import { LearnCardPicker } from '@/features/learn/ui/LearnCardPicker';
import { LearnComplete } from '@/features/learn/ui/LearnComplete';
import { LearnMultipleChoiceStage } from '@/features/learn/ui/LearnMultipleChoiceStage';
import { LearnStageIntro } from '@/features/learn/ui/LearnStageIntro';
import { LearnStageProgress } from '@/features/learn/ui/LearnStageProgress';
import { LearnWrittenStage } from '@/features/learn/ui/LearnWrittenStage';

type LearnSessionProps = {
  setId: string;
  setTitle: string;
  cards: SetCardRow[];
  learnedCardIds: string[];
};

const Header = styled.header`
  margin-bottom: 8px;
`;

const SetTitle = styled.h1`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
`;

const Empty = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const PickEmpty = styled.p`
  margin: 16px 0 0;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function LearnSession({
  setId,
  setTitle,
  cards,
  learnedCardIds,
}: LearnSessionProps) {
  const session = useLearnSession({
    allCards: cards,
    learnedCardIds,
  });

  const markLearned = useMarkCardsLearnedMutation(setId);
  const progressSavedRef = useRef(false);

  const {
    phase,
    sessionTarget,
    allLearned,
    pickingCard,
    selectedCount,
    addCardToSession,
    skipPickCard,
    stage1Card,
    stage1Index,
    stage1Total,
    advanceStage1,
    stage2Card,
    stage3Card,
    stage4Card,
    stage2Turn,
    stage3Turn,
    stage4Turn,
    answerMultipleChoice,
    answerWritten,
    completedStages,
    errorCounts,
    deck,
    selectedCards,
  } = session;

  useEffect(() => {
    if (
      phase !== 'complete' ||
      allLearned ||
      selectedCards.length === 0 ||
      progressSavedRef.current
    ) {
      return;
    }
    progressSavedRef.current = true;
    void markLearned.mutateAsync(selectedCards.map((c) => c.id));
  }, [allLearned, markLearned, phase, selectedCards]);

  if (cards.length === 0) {
    return <Empty>В наборе нет карточек. Добавьте слова в библиотеку.</Empty>;
  }

  if (phase === 'complete') {
    return (
      <LearnComplete
        setId={setId}
        setTitle={setTitle}
        cards={selectedCards.length > 0 ? selectedCards : cards}
        errorCounts={errorCounts}
        allLearned={allLearned && selectedCards.length === 0}
      />
    );
  }

  return (
    <>
      <Header>
        <SetTitle>{setTitle}</SetTitle>
      </Header>

      <LearnStageProgress phase={phase} completedStages={completedStages} />

      {phase === 'picking' && pickingCard && (
        <LearnCardPicker
          card={pickingCard}
          selectedCount={selectedCount}
          sessionTarget={sessionTarget}
          onAdd={addCardToSession}
          onSkip={skipPickCard}
        />
      )}

      {phase === 'picking' && !pickingCard && (
        <PickEmpty>
          Не выбрано ни одной карточки. Вернитесь позже или сбросьте прогресс
          изучения в настройках (скоро).
        </PickEmpty>
      )}

      {phase === 'stage1' && stage1Card && (
        <LearnStageIntro
          card={stage1Card}
          index={stage1Index}
          total={stage1Total}
          onContinue={advanceStage1}
        />
      )}

      {phase === 'stage2' && stage2Card && (
        <LearnMultipleChoiceStage
          key={stage2Turn}
          stage="stage2"
          card={stage2Card}
          deck={deck}
          turnKey={stage2Turn}
          onAnswer={(isCorrect) =>
            answerMultipleChoice('stage2', stage2Card.id, isCorrect)
          }
        />
      )}

      {phase === 'stage3' && stage3Card && (
        <LearnMultipleChoiceStage
          key={stage3Turn}
          stage="stage3"
          card={stage3Card}
          deck={deck}
          turnKey={stage3Turn}
          onAnswer={(isCorrect) =>
            answerMultipleChoice('stage3', stage3Card.id, isCorrect)
          }
        />
      )}

      {phase === 'stage4' && stage4Card && (
        <LearnWrittenStage
          key={stage4Turn}
          card={stage4Card}
          turnKey={stage4Turn}
          onSubmit={(result, correctAnswer) =>
            answerWritten(stage4Card.id, result, correctAnswer)
          }
        />
      )}
    </>
  );
}
