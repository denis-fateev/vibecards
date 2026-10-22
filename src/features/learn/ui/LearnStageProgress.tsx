import styled from 'styled-components';

import type { LearnSessionPhase, LearnStageId } from '@/features/learn/model/types';

type LearnStageProgressProps = {
  phase: LearnSessionPhase;
  completedStages: Set<LearnStageId>;
};

const STAGES: { id: LearnStageId; label: string }[] = [
  { id: 'stage1', label: 'Знакомство' },
  { id: 'stage2', label: 'Перевод → слово' },
  { id: 'stage3', label: 'Слово → перевод' },
  { id: 'stage4', label: 'Ввод' },
];

const Wrap = styled.div`
  margin-bottom: 24px;
`;

const Track = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  max-width: 420px;
`;

const Segment = styled.div<{ $filled: boolean; $active: boolean }>`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: ${({ theme, $filled, $active }) =>
    $filled || $active ? theme.colors.accent : theme.colors.border};
  opacity: ${({ $active, $filled }) => ($active && !$filled ? 0.55 : 1)};
`;

const Dots = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 420px;
  margin-top: 8px;
`;

const DotWrap = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const Dot = styled.span<{ $filled: boolean; $active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ theme, $filled, $active }) =>
    $filled
      ? theme.colors.accent
      : $active
        ? theme.colors.accentMuted
        : theme.colors.border};
  border: 2px solid
    ${({ theme, $filled, $active }) =>
      $filled || $active ? theme.colors.accent : theme.colors.border};
`;

const Label = styled.span`
  font-size: 0.625rem;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  line-height: 1.2;
  max-width: 72px;
`;

function stageIndex(phase: LearnSessionPhase): number {
  if (phase === 'picking' || phase === 'complete') return -1;
  return STAGES.findIndex((s) => s.id === phase);
}

export function LearnStageProgress({
  phase,
  completedStages,
}: LearnStageProgressProps) {
  if (phase === 'picking' || phase === 'complete') return null;

  const activeIdx = stageIndex(phase);

  return (
    <Wrap aria-label="Прогресс этапов обучения">
      <Track>
        {STAGES.map((stage, i) => (
          <Segment
            key={stage.id}
            $filled={completedStages.has(stage.id)}
            $active={i === activeIdx}
          />
        ))}
      </Track>
      <Dots>
        {STAGES.map((stage, i) => (
          <DotWrap key={stage.id}>
            <Dot
              $filled={completedStages.has(stage.id)}
              $active={i === activeIdx}
            />
            <Label>{stage.label}</Label>
          </DotWrap>
        ))}
      </Dots>
    </Wrap>
  );
}
