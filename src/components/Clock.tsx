import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '../features/useGame';
import { interval } from '../utils/interval';

// Put clock in its own component instead of game context to prevent all children of game to render every 10ms.

export function Clock() {
  const game = useGame();

  // Restart clock on every time travel
  const [ms, setMs] = useState(0);
  const abortControllerRef = useRef(new AbortController());
  useEffect(() => {
    abortControllerRef.current.abort();
    if (game.history.move.gameOver) return;
    abortControllerRef.current = new AbortController();
    interval(10, abortControllerRef.current.signal, (time) => setMs(time + game.history.move.totalMs));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.history.timeTravels]);

  // Allow useGame to save the totalMs of the move in the history
  const msRef = useRef(0);
  useEffect(() => {
    msRef.current = ms;
  }, [ms]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => game.config.setMsGetter(() => msRef.current), []);

  // Stop updates when the game ends
  useEffect(() => {
    if (game.history.move.gameOver) abortControllerRef.current.abort();
  }, [game.history.move.gameOver]);

  // Stop updates if component unmounts
  useEffect(() => () => abortControllerRef.current.abort(), []);

  const formattedMs = new Date(ms).toISOString().slice(14, 23);

  return <span>Time: {formattedMs}</span>;
}
