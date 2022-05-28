import { useState } from 'react';

export function useGameClock() {
  const [seconds, setSeconds] = useState(0);

  function increment() {
    setSeconds((seconds) => seconds + 1);
  }

  return {
    seconds,
    increment,
    setSeconds,
  };
}
