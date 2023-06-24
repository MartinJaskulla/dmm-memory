import React, { useRef } from 'react';
import { Clock } from 'src/hooks/useClock/clock';

const ClockContext = React.createContext<Clock | null>(null);

interface ClockProps {
  children: React.ReactNode;
}

export const ClockProvider = ({ children }: ClockProps) => {
  return <ClockContext.Provider value={useRef(new Clock()).current}>{children}</ClockContext.Provider>;
};

export function useClock(): Clock {
  const context = React.useContext(ClockContext);
  if (!context) throw new Error('useClock must be used within a ClockProvider');
  return context;
}
