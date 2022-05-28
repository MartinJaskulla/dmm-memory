import { useRef } from 'react';
import { animationInterval } from './timer';

const SECOND = 1000;
const COUNTDOWN = 15 * SECOND;

export function useCountdown(onZero: () => void) {
  const abortControllerRef = useRef(new AbortController());
  function start() {
    abortControllerRef.current = new AbortController();
    animationInterval(COUNTDOWN, abortControllerRef.current.signal, () => {
      abortControllerRef.current.abort();
      onZero();
    });
  }
  function stop() {
    abortControllerRef.current.abort();
  }
  return { start, stop };
}
