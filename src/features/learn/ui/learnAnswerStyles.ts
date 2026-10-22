import { css, keyframes } from 'styled-components';

export const learnCorrectBorder = '#12b76a';
export const learnCorrectBg = '#ecfdf3';
export const learnWrongBorder = '#f04438';
export const learnWrongBg = '#fef3f2';

const wrongPulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(240, 68, 56, 0.4);
  }
  100% {
    box-shadow: 0 0 0 10px rgba(240, 68, 56, 0);
  }
`;

const correctPulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(18, 183, 106, 0.45);
  }
  100% {
    box-shadow: 0 0 0 10px rgba(18, 183, 106, 0);
  }
`;

export const learnCorrectHighlight = css`
  border-color: ${learnCorrectBorder};
  background: ${learnCorrectBg};
  animation: ${correctPulse} 0.45s ease-out;
`;

export const learnWrongHighlight = css`
  border-color: ${learnWrongBorder};
  background: ${learnWrongBg};
  color: ${learnWrongBorder};
  animation: ${wrongPulse} 0.45s ease-out;
`;

export const learnCorrectTextHighlight = css`
  color: ${learnCorrectBorder};
  font-weight: 600;
`;

export const learnWrongTextHighlight = css`
  color: ${learnWrongBorder};
  font-weight: 600;
  text-decoration: line-through;
  text-decoration-color: rgba(240, 68, 56, 0.55);
`;
