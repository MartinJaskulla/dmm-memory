import { NO_COUNTDOWN, useGame } from '../features/useGame';
import React, { useEffect, useState } from 'react';
import { formatMs } from '../utils/formatMs';

const TIME_OUT = 'Time is up! 😭';

export function Countdown() {
  const game = useGame();

  const [ms, setMs] = useState(game.move.timeLimit);

  useEffect(() => {
    setMs(game.move.timeLimit);
    if (game.move.timeLimit === NO_COUNTDOWN) return;
    return game.subscribeToClock((ms) => {
      const nextMs = getRemainingMs(ms, game.move.totalMs, game.move.timeLimit);
      // nextMs can be less than 0, if the user switches to a different tab (requestAnimationFrame does not run) and returns after the countdown is up.
      setMs(nextMs < 0 ? 0 : nextMs);
    });
  }, [game.move]);

  useEffect(() => {
    if (ms === 0)
      game.saveMove({
        gameOver: { win: false, reason: TIME_OUT },
        totalMs: game.move.totalMs + game.move.timeLimit,
      });
  }, [ms]);

  if (game.move.gameOver?.reason === TIME_OUT) return <DisplayedCountdown ms={0} />;
  if (ms === NO_COUNTDOWN) return null;
  return <DisplayedCountdown ms={ms} />;
}

function DisplayedCountdown({ ms }: { ms: number }) {
  return <div>⏳ {formatMs(ms)}</div>;
}

export function getRemainingMs(clockMs: number, moveMs: number, moveTimeLimit: number) {
  const msSinceStart = clockMs - moveMs;
  return moveTimeLimit - msSinceStart;
}
