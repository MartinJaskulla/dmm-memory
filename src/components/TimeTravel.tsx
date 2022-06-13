import React from 'react';
import { useGame } from '../features/useGame';

export function TimeTravel() {
  const game = useGame();

  return (
    <div>
      {game.moves.map((s, i) => {
        return (
          <div key={i}>
            <button onClick={() => game.goToMove(i)}>Go to {i}</button>
          </div>
        );
      })}
    </div>
  );
}
