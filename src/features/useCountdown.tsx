import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { interval } from '../utils/interval';
import { TimeLimit } from './useGame';

export type CountdownValue = { remaining: TimeLimit; stop: () => void; restart: (timeLimit: TimeLimit) => void };

const defaultValue: CountdownValue = {
  remaining: -1,
  stop: () => null,
  restart: () => null,
};

const CountdownContext = createContext<CountdownValue>(defaultValue);

interface CountdownProps {
  children: ReactNode;
}

const CountdownProvider = ({ children }: CountdownProps) => {
  const [remaining, setRemaining] = useState<TimeLimit>(defaultValue.remaining);
  const abortControllerRef = useRef(new AbortController());

  useEffect(() => {
    if (remaining === 0) stop();
  }, [remaining]);

  function restart(timeLimit: TimeLimit) {
    abortControllerRef.current.abort();
    setRemaining(timeLimit);
    abortControllerRef.current = new AbortController();
    interval(1000, abortControllerRef.current.signal, () => setRemaining((seconds) => seconds - 1));
  }

  function stop() {
    abortControllerRef.current.abort();
    setRemaining(defaultValue.remaining);
  }

  const value: CountdownValue = {
    remaining,
    restart,
    stop,
  };

  return <CountdownContext.Provider value={value}>{children}</CountdownContext.Provider>;
};

function useCountdown(): CountdownValue {
  return useContext(CountdownContext);
}

export { CountdownProvider, useCountdown };
