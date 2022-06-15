import { NO_COUNTDOWN, useGame } from '../features/useGame';
import React, { useEffect, useState } from 'react';
import { formatMs } from '../utils/formatMs';

const TIME_OUT = 'Time is up! 😭';

export function Countdown() {
  const game = useGame();

  const [remainingMs, setRemainingMs] = useState(game.move.msPerMove);

  useEffect(() => {
    setRemainingMs(game.move.msPerMove);
    if (game.move.msPerMove === NO_COUNTDOWN) return;
    return game.subscribeToClock((msPlayed) => {
      const newRemaining = getRemainingMs(msPlayed, game.move.msPlayed, game.move.msPerMove);
      // newRemaining can be less than 0 if the user switches to a different tab (requestAnimationFrame does not run) and returns after the countdown is over.
      setRemainingMs(newRemaining < 0 ? 0 : newRemaining);
    });
  }, [game.move]);

  useEffect(() => {
    if (remainingMs === 0)
      game.saveMove({
        gameOver: { win: false, reason: TIME_OUT },
        msPlayed: game.move.msPlayed + game.move.msPerMove,
      });
  }, [remainingMs]);

  if (game.move.gameOver?.reason === TIME_OUT) return <DisplayedCountdown ms={0} />;
  if (remainingMs === NO_COUNTDOWN) return null;
  return <DisplayedCountdown ms={remainingMs} />;
}

function DisplayedCountdown({ ms }: { ms: number }) {
  return <div>⏳ {formatMs(ms)}</div>;
}

export function getRemainingMs(clockMs: number, moveMs: number, moveTimeLimit: number) {
  const msSinceStart = clockMs - moveMs;
  return moveTimeLimit - msSinceStart;
}
