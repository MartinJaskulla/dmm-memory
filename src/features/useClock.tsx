import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useEverySecond } from '../utils/interval';

export type ClockUnit = number;

export interface ClockValue {
  time: ClockUnit;
  setTime: (seconds: ClockUnit) => void;
}

const ClockContext = createContext<ClockValue>({ time: 0, setTime: () => null });

interface ClockProps {
  children: ReactNode;
}

const ClockProvider = ({ children }: ClockProps) => {
  const [time, setTime] = useState<ClockUnit>(0);
  // TODO Is still inaccurate if someone changes game clock at 0.3s. Do what countdown does instead.
  // TODO Use timestamps
  useEverySecond(() => setTime((seconds) => seconds + 1));

  const value: ClockValue = { time, setTime };

  return <ClockContext.Provider value={value}>{children}</ClockContext.Provider>;
};
function useClock(): ClockValue {
  return useContext(ClockContext);
}

export { ClockProvider, useClock };
