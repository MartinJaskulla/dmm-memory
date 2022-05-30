import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { interval } from '../utils/interval';
import { TimeLimit } from './useGame';

export type CountdownValue = { remaining: TimeLimit; stop: () => void; start: (timeLimit: TimeLimit) => void };

const CountdownContext = createContext<CountdownValue>({
  remaining: null,
  stop: () => null,
  start: () => null,
});

interface CountdownProps {
  children: ReactNode;
}

const CountdownProvider = ({ children }: CountdownProps) => {
  const [remaining, setRemaining] = useState<TimeLimit>(null);
  const abortControllerRef = useRef(new AbortController());

  useEffect(() => {
    if (remaining === 0) stop();
  }, [remaining]);

  function start(timeLimit: TimeLimit) {
    if (timeLimit === null) return;
    setRemaining(timeLimit);
    abortControllerRef.current = new AbortController();
    interval(1000, abortControllerRef.current.signal, () =>
      setRemaining((seconds) => (typeof seconds === 'number' ? seconds - 1 : seconds)),
    );
  }

  function stop() {
    abortControllerRef.current.abort();
    setRemaining(null);
  }

  const value: CountdownValue = {
    remaining,
    start,
    stop,
  };

  return <CountdownContext.Provider value={value}>{children}</CountdownContext.Provider>;
};

function useCountdown(): CountdownValue {
  return useContext(CountdownContext);
}

export { CountdownProvider, useCountdown };
