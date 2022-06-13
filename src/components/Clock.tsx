import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '../features/useGame';
import { interval } from '../utils/interval';

// Put clock in its own component instead of game context to prevent all children of game to render every 10ms.
//
setTimeout(() => {
  alert('hi');
}, 3000);

export function Clock() {
  const game = useGame();
  // TODO Comment I want high performance with requestAnimationFrame, but also pause when switching tabs. Otherwise I need to consider skipped second events while user was away.
  // requestAnimationFrame in interval.ts does not run while the browser tab is in the background.
  // I want thehile the user switches to a different tab or a main thread blocking
  // alert() is shown. More precisely, interval() is not triggered on both scenarios, but when the tab regains focus, the diff will
  // include the time the user was away / the alert was open for. If the clock should be paused in these scenarios, the diff
  // needs to be stored in useState and increased by a fixed amount (the same amount as the interval timeout) every x ms by interval().
  // The pauseable approach is only feasible with seconds. With milliseconds the clock will "slow down",
  // because interval() skips some updates to stay consistent. This gets more noticeable the more frequent the updates are.
  const [ms, setMs] = useState(0);
  const abortControllerRef = useRef(new AbortController());
  const gameStartRef = useRef(new Date());

  useEffect(() => {
    abortControllerRef.current.abort();
    gameStartRef.current = new Date(new Date().getTime() - game.history.move.totalMs);
    if (game.history.move.gameOver) return;
    abortControllerRef.current = new AbortController();
    interval(10, abortControllerRef.current.signal, () => setMs(getMs()));
    // Restart clock on every time travel
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.history.timeTravels]);

  // Allow useGame to trigger functionality after X seconds
  const seconds = Math.floor(ms / 1000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => game.callbacks.onSecond(seconds), [seconds]);

  // Allow useGame to save the totalMs of the move in the history
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => game.callbacks.setMsGetter(() => getMs()), []); // TODO Check

  // Stop updates when the game ends
  useEffect(() => {
    if (game.history.move.gameOver) abortControllerRef.current.abort();
  }, [game.history.move.gameOver]);

  // Stop updates if component unmounts
  useEffect(() => () => abortControllerRef.current.abort(), []);

  useEffect(() => {
    const cb = () => {
      setMs((ms) => {
        gameStartRef.current = new Date(new Date().getTime() - ms);
        return ms;
      });
    };
    window.addEventListener('visibilitychange', cb);
    return () => window.removeEventListener('visibilitychange', cb);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getMs(): number {
    // console.log(2);
    return new Date(new Date().getTime() - gameStartRef.current.getTime()).getTime();
  }

  const formattedMs = new Date(ms).toISOString().slice(14, 23);

  return <span>Time: {formattedMs}</span>;
}
