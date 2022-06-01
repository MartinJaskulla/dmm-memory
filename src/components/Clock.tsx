import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '../features/useGame';
import { interval } from '../utils/interval';

export function Clock() {
  const game = useGame();
  const [seconds, setSeconds] = useState(0);

  const abortControllerRef = useRef(new AbortController());
  useEffect(() => () => abortControllerRef.current.abort(), []);

  useEffect(() => {
    abortControllerRef.current.abort();
    setSeconds(new Date(game.history.move.totalMs).getUTCSeconds());
    start(game.history.move.totalMs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.history.moveIndex]);

  function start(startingMs: number) {
    if (game.history.move.gameOver) return;
    abortControllerRef.current = new AbortController();
    const msToNextSecond = 1000 - (startingMs % 1000);
    // When traveling back in time to a move which was made 7.3s in, the clock needs to be updated in 0.7s.
    interval(msToNextSecond, abortControllerRef.current.signal, () => {
      abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();
      setSeconds((seconds) => seconds + 1);
      // Now we can update every second
      interval(1000, abortControllerRef.current.signal, () => setSeconds((seconds) => seconds + 1));
    });
  }

  const formattedSeconds = new Date(seconds * 1000).toISOString().slice(14, 19);

  return <span>Time: {formattedSeconds}</span>;
}
