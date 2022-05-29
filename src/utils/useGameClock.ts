import { useState } from 'react';
import { useEverySecond } from './timer';

export function useGameClock() {
  const [seconds, setSeconds] = useState(0);
  useEverySecond(() => setSeconds((seconds) => seconds + 1));

  return {
    seconds,
    setSeconds,
  };
}
