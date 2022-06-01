import React from 'react';
import { useGame } from '../features/useGame';

export function TimeTravel() {
  const { history } = useGame();
  // TODO Game should not expose whole history. should expose custom function to time travel which calc totalMs
  return (
    <div>
      {history.moves.map((s, i) => {
        return (
          <div key={i}>
            <button onClick={() => history.goToMove(i)}>Go to {i}</button>
          </div>
        );
      })}
    </div>
  );
}
