import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useEverySecond } from '../utils/interval';

export type ClockUnit = Date;

export interface ClockValue {
  time: ClockUnit;
  setTime: (seconds: ClockUnit) => void;
}

const defaultValue: ClockValue = { time: new Date(0), setTime: () => null };

const ClockContext = createContext<ClockValue>(defaultValue);

interface ClockProps {
  children: ReactNode;
}

const ClockProvider = ({ children }: ClockProps) => {
  const [time, setTime] = useState<ClockUnit>(defaultValue.time);
  useEverySecond(() => setTime((date) => new Date(date.getTime() + 1000)));

  const value: ClockValue = { time, setTime };

  return <ClockContext.Provider value={value}>{children}</ClockContext.Provider>;
};
function useClock(): ClockValue {
  return useContext(ClockContext);
}

export { ClockProvider, useClock };
