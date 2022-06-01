import React from 'react';
import owlImgSrc from '../images/owl.svg';
import styled from 'styled-components';
import { useGame } from '../features/useGame';
import { useClock } from '../features/useClock';
import { useCountdown } from '../features/useCountdown';

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
  const countdown = useCountdown();
  const game = useGame();

  const formattedSeconds = (game.over ? game.timePlayed : clock.time).toISOString().slice(14, 19);

  return (
    <StyledHeader>
      <h1>
        <img alt="Memory Game Logo" src={owlImgSrc} />
        Memory Game
      </h1>
      {countdown.remaining > -1 && <div>Countdown: {countdown.remaining}</div>}
      <div>
        <span>Moves: {game.moves}</span>|<span>Time: {formattedSeconds}</span>
      </div>
    </StyledHeader>
  );
}
