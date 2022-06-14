import { NO_COUNTDOWN, useGame } from '../features/useGame';
import React, { useEffect, useState } from 'react';
import { formatMs } from '../utils/formatMs';

const TIME_OUT = 'Time is up! 😭';

export function Countdown() {
  const game = useGame();

  const [ms, setMs] = useState(game.move.timeLimit * 1000);

  useEffect(() => {
    setMs(game.move.timeLimit * 1000);
    if (game.move.timeLimit === NO_COUNTDOWN) return;
    return game.subscribeToClock((ms) => {
      const msSinceStart = ms - game.move.totalMs;
      const nextMs = game.move.timeLimit * 1000 - msSinceStart;
      // nextMs can be less than 0, if the user switches to a different tab (requestAnimationFrame does not run) and returns after the countdown is up.
      setMs(nextMs < 0 ? 0 : nextMs);
    });
  }, [game.move]);

  useEffect(() => {
    if (ms === 0)
      game.saveMove({
        gameOver: { win: false, reason: TIME_OUT },
        totalMs: game.move.totalMs + game.move.timeLimit * 1000,
      });
  }, [ms]);

  if (game.move.gameOver?.reason === TIME_OUT) return <DisplayedCountdown ms={0} />;
  if (ms === NO_COUNTDOWN) return null;
  return <DisplayedCountdown ms={ms} />;
}

function DisplayedCountdown({ ms }: { ms: number }) {
  return <div>⏳ {formatMs(ms)}</div>;
}
