import React from 'react';
import owlImgSrc from '../images/owl.svg';
import styled from 'styled-components';
import { useGame } from '../features/useGame';
import { useClock } from '../features/useClock';

const StyledHeader = styled.header`
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  color: var(--color-text);
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-size: 24px;
    font-weight: 700;
    line-height: 1.5;
    margin: 0;
  }

  img {
    height: 1.2em;
    object-fit: contain;
    vertical-align: middle;
    width: auto;
    margin-right: 8px;
  }
`;

export function Header() {
  const clock = useClock();
  const { moves, timeLimit } = useGame();
  const formattedSeconds = new Date(clock.time * 1000).toISOString().slice(14, 19);

  return (
    <StyledHeader>
      <h1>
        <img alt="Memory Game Logo" src={owlImgSrc} />
        Memory Game
      </h1>
      {typeof timeLimit === 'number' && <div>Countdown: {timeLimit}</div>}
      <div>
        <span>Moves: {moves}</span>|<span>Time: {formattedSeconds}</span>
      </div>
    </StyledHeader>
  );
}
