import { NO_COUNTDOWN, TimeLimit, useGame } from '../features/useGame';
import React, { useEffect, useRef, useState } from 'react';
import { Clock } from '../utils/clock';

export function Countdown() {
  const game = useGame();

  const [ms, setMs] = useState<TimeLimit>(game.move.timeLimit * 1000);
  // TODO Maybe I can get rid of the ref and just subscribe to clock like in Clock
  const unsubscribeClockRef = useRef<ReturnType<typeof Clock['prototype']['subscribe']>>(() => null);

  useEffect(() => {
    unsubscribeClockRef.current();
    setMs(game.move.timeLimit * 1000);
    if (game.move.timeLimit === NO_COUNTDOWN) return;
    unsubscribeClockRef.current = game.subscribeToClock((ms) => {
      const msSinceStart = ms - game.move.totalMs;
      const nextRemainingSeconds = game.move.timeLimit * 1000 - msSinceStart;
      // nextRemainingSeconds can be less than 0, if the user switches to a different tab (requestAnimationFrame does not run) and returns after the countdown is up.
      setMs(nextRemainingSeconds < 0 ? 0 : nextRemainingSeconds);
    });
  }, [game.move.timeLimit, game.move]);

  useEffect(() => unsubscribeClockRef.current, []);

  useEffect(() => {
    if (ms === 0) game.loose('Time is up! 😭');
  }, [ms]);

  if (ms === NO_COUNTDOWN) return null;

  const formattedMs = new Date(ms).toISOString().slice(14, 23);

  return <div>⏳ {formattedMs}</div>;
}
