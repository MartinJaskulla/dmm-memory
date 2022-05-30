import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { interval } from '../utils/interval';
import { TimeLimit, useGame } from './useGame';

export type CountdownValue = TimeLimit;

const CountdownContext = createContext<CountdownValue>(null);

interface CountdownProps {
  children: ReactNode;
}

const CountdownProvider = ({ children }: CountdownProps) => {
  const [time, setTime] = useState<TimeLimit>(null);
  const abortControllerRef = useRef(new AbortController());
  const { newGame, choice1, choice2, timeLimit } = useGame();

  useEffect(() => {
    if (time === 0) {
      stop();
      alert('Time is up!');
      newGame();
    }
    // Can't wait for useEvent: https://github.com/reactjs/rfcs/pull/220
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  useEffect(() => {
    stop();
    if (choice1 && !choice2) start(timeLimit);
  }, [choice1, choice2, timeLimit]);

  function start(timeLimit: TimeLimit) {
    if (timeLimit === null) return;
    setTime(timeLimit);
    abortControllerRef.current = new AbortController();
    interval(1000, abortControllerRef.current.signal, () =>
      setTime((seconds) => (typeof seconds === 'number' ? seconds - 1 : seconds)),
    );
  }

  function stop() {
    abortControllerRef.current.abort();
    setTime(null);
  }

  return <CountdownContext.Provider value={time}>{children}</CountdownContext.Provider>;
};

function useCountdown(): CountdownValue {
  return useContext(CountdownContext);
}

export { CountdownProvider, useCountdown };
