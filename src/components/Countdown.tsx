import { NO_COUNTDOWN, useGame } from '../hooks/useGame';
import React, { useEffect, useState } from 'react';
import { formatMs } from '../utils/formatMs';
import { CONFIG } from '../config/config';
import { GAME_OVER } from '../config/gameOver';

export function Countdown() {
  const game = useGame();

  const [remainingMs, setRemainingMs] = useState(game.move.msPerMove);

  useEffect(() => {
    setRemainingMs(game.move.msPerMove);
    if (game.move.msPerMove === NO_COUNTDOWN || game.move.gameOver) return;
    return game.subscribeToClock((msPlayed) => {
      const newRemaining = getRemainingMs(msPlayed, game.move.msPlayed, game.move.msPerMove);
      // newRemaining can be less than 0 if the user switches to a different tab (requestAnimationFrame does not run) and returns after the countdown is over.
      setRemainingMs(newRemaining < 0 ? 0 : newRemaining);
    });
  }, [game.move]);

  useEffect(() => {
    if (remainingMs === 0)
      game.saveMove({
        gameOver: GAME_OVER.TIME_PER_MOVE_RAN_OUT,
        msPlayed: game.move.msPlayed + game.move.msPerMove,
      });
  }, [remainingMs]);

  if (game.move.gameOver === GAME_OVER.TIME_PER_MOVE_RAN_OUT) {
    return <DisplayedCountdown ms={0} />;
  }

  if (game.move.gameOver) {
    return (
      <DisplayedCountdown
        ms={game.move.msPerMove - (game.move.msPlayed - game.moves[game.moves.length - 2].msPlayed)}
      />
    );
  }
  if (remainingMs === NO_COUNTDOWN) {
    return <DisplayedCountdown ms={CONFIG.TIME_PER_MOVE} />;
  }
  return <DisplayedCountdown ms={remainingMs} />;
}

function DisplayedCountdown({ ms }: { ms: number }) {
  return <div>⏳ {formatMs(ms)}</div>;
}

export function getRemainingMs(clockMs: number, moveMs: number, moveTimeLimit: number) {
  const msSinceStart = clockMs - moveMs;
  return moveTimeLimit - msSinceStart;
}
