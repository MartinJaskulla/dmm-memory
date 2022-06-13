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
    interval(1000, abortControllerRef.current.signal, () => setRemaining((seconds) => seconds - 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.history.moveIndex, game.history.timeTravels]);

  useEffect(() => {
    game.callbacks.onCountdown(remaining);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  return <>{remaining > NO_COUNTDOWN && <div>Countdown: {remaining}</div>}</>;
}
