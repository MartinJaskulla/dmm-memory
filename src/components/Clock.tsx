import React, { useEffect, useRef, useState } from 'react';
import { Move, useGame } from '../features/useGame';
import { interval } from '../utils/interval';

// Put clock in its own component instead of game context to prevent all children of game to render every second.

export function Clock() {
  const game = useGame();
  const [seconds, setSeconds] = useState(0);

  const abortControllerRef = useRef(new AbortController());

  useEffect(() => {
    abortControllerRef.current.abort();
    setSeconds(new Date(game.history.move.totalMs).getUTCSeconds());
    start(game.history.move, abortControllerRef, setSeconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.history.timeTravels]);

  useEffect(() => {
    if (game.history.move.gameOver) abortControllerRef.current.abort();
  }, [game.history.move.gameOver]);

  useEffect(() => () => abortControllerRef.current.abort(), []);

  const formattedSeconds = new Date(seconds * 1000).toISOString().slice(14, 19);

  return <span>Time: {formattedSeconds}</span>;
}

function start(
  move: Move,
  abortControllerRef: React.MutableRefObject<AbortController>,
  setSeconds: React.Dispatch<React.SetStateAction<number>>,
) {
  if (move.gameOver) return;
  abortControllerRef.current = new AbortController();
  const msToNextSecond = 1000 - (move.totalMs % 1000);
  // When traveling back in time to a move which was made 7.3s in, the clock needs to be updated in 0.7s once.
  interval(msToNextSecond, abortControllerRef.current.signal, () => {
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    setSeconds((seconds) => seconds + 1);
    // Now we can update every second
    interval(1000, abortControllerRef.current.signal, () => setSeconds((seconds) => seconds + 1));
  });
}
