import { useEffect, useState } from 'react';
import { GameContextValue } from '../contexts/gameContext';

export function useCountdown(onZero: () => void) {
  const [seconds, setSeconds] = useState<GameContextValue['countdown']>(null);

  useEffect(() => {
    if (seconds === 0) {
      stop();
      onZero();
    }
    // Can't wait for useEvent: https://github.com/reactjs/rfcs/pull/220
    // If I specify onZero in the dependency array, the parent needs to wrap onZero in useCallback,
    // which then requires newGame to be wrapped in useCallback and so on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  function start(timeLimit: GameContextValue['countdown']) {
    setSeconds(timeLimit);
  }

  function stop() {
    setSeconds(null);
  }

  function decrement() {
    setSeconds((seconds) => (seconds === null ? null : seconds - 1));
  }

  return { start, stop, seconds, decrement };
}
