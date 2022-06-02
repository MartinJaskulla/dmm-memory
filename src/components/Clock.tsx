import React, { useEffect, useRef, useState } from 'react';
import { MsGetter, useGame } from '../features/useGame';
import { interval } from '../utils/interval';

// Put clock in its own component instead of game context to prevent all children of game to render every 10ms.

export function Clock() {
  const game = useGame();
  // This approach will "run" the clock in the background while the user switches to a different tab or a main thread blocking
  // alert() is shown. More precisely, interval() is not triggered on both scenarios, but when the tab regains focus, the diff will
  // include the time the user was away / the alert was open for. If the clock should be paused in these scenarios, the diff
  // needs to be stored in useState and increased by a fixed amount (the same amount as the interval timeout) every x ms by interval().
  // The pauseable approach is only feasible with seconds. With milliseconds the clock will "slow down",
  // because interval() skips some updates to stay consistent. This gets more noticeable the more frequent the updates are.
  const [, triggerUpdate] = useState({});

  // Restart clock on every time travel
  const abortControllerRef = useRef(new AbortController());
  const gameStartRef = useRef(new Date());
  useEffect(() => {
    abortControllerRef.current.abort();
    gameStartRef.current = new Date(new Date().getTime() - game.history.move.totalMs);
    if (game.history.move.gameOver) return;
    abortControllerRef.current = new AbortController();
    interval(10, abortControllerRef.current.signal, () => triggerUpdate({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.history.timeTravels]);

  // Allow useGame to trigger functionality after X seconds
  const seconds = Math.floor(getDiff().getTime() / 1000);
  useEffect(() => {
    game.callbacks.everySecond(seconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  // Allow useGame to save the totalMs of the move in the history
  const msGetter: MsGetter = () => getDiff().getTime();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => game.callbacks.setMsGetter(msGetter), []);

  // Stop updates when the game ends
  useEffect(() => {
    if (game.history.move.gameOver) abortControllerRef.current.abort();
  }, [game.history.move.gameOver]);

  // Stop updates if component unmounts
  useEffect(() => () => abortControllerRef.current.abort(), []);

  function getDiff(): Date {
    return new Date(new Date().getTime() - gameStartRef.current.getTime());
  }

  const formattedMs = getDiff().toISOString().slice(14, 23);

  return <span>Time: {formattedMs}</span>;
}
