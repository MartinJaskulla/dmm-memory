import { NO_COUNTDOWN, TimeLimit, useGame } from '../features/useGame';
import React, { useEffect, useRef, useState } from 'react';

// Countdown cannot reuse the game clock, because the countdown always starts on a full second,
// while the clock might start on 1.32s when time traveling.

export function Countdown() {
  const game = useGame();
  const [remaining] = useState<TimeLimit>(game.move.timeLimit);
  const abortControllerRef = useRef(new AbortController());

  // Restart the timeout, every time a new card is revealed or the user does a time travel
  // useEffect(() => {
  //   abortControllerRef.current.abort();
  //   setRemaining(game.move.timeLimit);
  //   if (game.move.timeLimit < 0) return;
  //   abortControllerRef.current = new AbortController();
  //   interval(1000, abortControllerRef.current.signal, (time) => {
  //     const nextRemaining = game.move.timeLimit - Math.round(time / 1000);
  //     // nextRemaining can be less than 0, if the user switches to a different tab (requestAnimationFrame does not run) and returns after the countdown is up.
  //     return setRemaining(nextRemaining < 0 ? 0 : nextRemaining);
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [game.moveIndex, game.timeTravels]);

  useEffect(() => {
    if (remaining === 0) game.loose('Time is up! 😭');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  // Stop updates when the game ends
  useEffect(() => {
    if (game.move.gameOver) abortControllerRef.current.abort();
  }, [game.move.gameOver]);

  // Stop updates if component unmounts
  useEffect(() => () => abortControllerRef.current.abort(), []);

  return <>{remaining > NO_COUNTDOWN && <div>⏳ {remaining}</div>}</>;
}
