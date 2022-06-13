import { NO_COUNTDOWN, TimeLimit, useGame } from '../features/useGame';
import React, { useEffect, useRef, useState } from 'react';
import { interval } from '../utils/interval';

// Countdown cannot reuse the game clock, because the countdown always starts on a full second,
// while the clock might start on 1.32s when time traveling.

export function Countdown() {
  const game = useGame();
  const [remaining, setRemaining] = useState<TimeLimit>(game.history.move.timeLimit);
  const abortControllerRef = useRef(new AbortController());

  // Restart the timeout, every time a new card is revealed or the user does a time travel
  useEffect(() => {
    abortControllerRef.current.abort();
    setRemaining(game.history.move.timeLimit);
    if (game.history.move.timeLimit < 0) return;
    abortControllerRef.current = new AbortController();
    interval(1000, abortControllerRef.current.signal, (time) => {
      const nextRemaining = game.history.move.timeLimit - Math.round(time / 1000);
      // nextRemaining can be less than 0, if the user switches to a different tab (requestAnimationFrame does not run) and returns after the countdown is up.
      return setRemaining(nextRemaining < 0 ? 0 : nextRemaining);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.history.moveIndex, game.history.timeTravels]);

  useEffect(() => {
    if (remaining === 0) game.loose('Time is up! 😭');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  // Stop updates when the game ends
  useEffect(() => {
    if (game.history.move.gameOver) abortControllerRef.current.abort();
  }, [game.history.move.gameOver]);

  // Stop updates if component unmounts
  useEffect(() => () => abortControllerRef.current.abort(), []);

  return <>{remaining > NO_COUNTDOWN && <div>Countdown: {remaining}</div>}</>;
}
