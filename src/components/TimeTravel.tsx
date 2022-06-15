import React from 'react';
import { useGame } from '../features/useGame';
import styled from 'styled-components';

const StyledInput = styled.input`
  margin-right: 1rem;
`;

export function TimeTravel() {
  const game = useGame();

  return (
    <div>
      <StyledInput
        type="range"
        step="1"
        min="0"
        max={game.moves.length - 1}
        value={game.moveIndex}
        onChange={(event) => game.goToMove(Number(event.target.value))}
      />
      <button onClick={() => game.goToMove(game.moveIndex)}>🐾 {game.moveIndex}</button>
    </div>
  );
}
