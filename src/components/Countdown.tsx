import { TimeLimit, useGame } from '../features/useGame';
import React, { useEffect, useRef, useState } from 'react';
import { interval } from '../utils/interval';

export function Countdown() {
  const game = useGame();
  const [remaining, setRemaining] = useState<TimeLimit>(game.history.move.timeLimit);
  const abortControllerRef = useRef(new AbortController());

  useEffect(() => {
    // debugger
    abortControllerRef.current.abort();
    setRemaining(game.history.move.timeLimit);
    if (game.history.move.timeLimit < 0) return;
    abortControllerRef.current = new AbortController();
    interval(1000, abortControllerRef.current.signal, () => setRemaining((seconds) => seconds - 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.history.moveIndex, game.history.timeTravels]);

  useEffect(() => {
    game.callbacks.countdown(remaining);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  return <>{remaining > -1 && <div>Countdown: {remaining}</div>}</>;
}
