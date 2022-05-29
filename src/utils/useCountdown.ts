import { useEffect, useRef, useState } from 'react';
import { animationInterval } from './timer';
import { GameContextValue } from '../contexts/gameContext';

export function useCountdown(onZero: () => void) {
  const [seconds, setSeconds] = useState<GameContextValue['countdown']>(null);
  const abortControllerRef = useRef(new AbortController());

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

  function start(timeLimit: number) {
    setSeconds(timeLimit);
    abortControllerRef.current = new AbortController();
    animationInterval(1000, abortControllerRef.current.signal, () =>
      setSeconds((seconds) => (typeof seconds === 'number' ? seconds - 1 : seconds)),
    );
  }

  function stop() {
    abortControllerRef.current.abort();
    setSeconds(null);
  }

  return { start, stop, seconds };
}
