import React from 'react';
import { useHistoryValue, History } from './useHistoryValue';

const HistoryContext = React.createContext<History>({} as History);

interface HistoryProps {
  children: React.ReactNode;
}

export const HistoryProvider = ({ children }: HistoryProps) => {
  return <HistoryContext.Provider value={useHistoryValue()}>{children}</HistoryContext.Provider>;
};

export function useHistory(): History {
  return React.useContext(HistoryContext);
}
