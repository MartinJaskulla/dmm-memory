import { useEffect, useRef, useState } from 'react';
import { interval } from '../utils/interval';

type TimeLimit = number | null;

export function useCountdown(onZero: () => void) {
  const [seconds, setSeconds] = useState<TimeLimit>(null);
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

  function start(timeLimit: TimeLimit) {
    if (timeLimit === null) return;
    setSeconds(timeLimit);
    abortControllerRef.current = new AbortController();
    interval(1000, abortControllerRef.current.signal, () =>
      setSeconds((seconds) => (typeof seconds === 'number' ? seconds - 1 : seconds)),
    );
  }

  function stop() {
    abortControllerRef.current.abort();
    setSeconds(null);
  }

  return { start, stop, seconds };
}
