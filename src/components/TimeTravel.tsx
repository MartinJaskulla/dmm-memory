import React from 'react';
import { useGame } from '../features/useGame';

// TODO Place nicer with css

export function TimeTravel() {
  const game = useGame();

  return (
    <div>
      {game.moves.map((s, i) => {
        return (
          <div key={i}>
            <button onClick={() => game.goToMove(i)}>{i}</button>
          </div>
        );
      })}
    </div>
  );
}
