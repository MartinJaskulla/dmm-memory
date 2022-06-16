import React, { useRef } from 'react';
import { Clock } from './clock';

const ClockContext = React.createContext<Clock>({} as Clock);

interface ClockProps {
  children: React.ReactNode;
}

export const ClockProvider = ({ children }: ClockProps) => {
  return <ClockContext.Provider value={useRef(new Clock()).current}>{children}</ClockContext.Provider>;
};

export function useClock(): Clock {
  return React.useContext(ClockContext);
}
