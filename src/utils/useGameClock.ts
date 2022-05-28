import { useState } from 'react';
import { useAnimationInterval } from './timer';

export function useGameClock(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useAnimationInterval(1000, () => setSeconds((seconds) => seconds + 1));
  return {
    seconds,
    setSeconds,
  };
}
