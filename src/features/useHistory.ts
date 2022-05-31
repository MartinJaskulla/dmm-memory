import { useState } from 'react';
import { deepFreeze } from '../utils/deepFreeze';

export function useHistory<Snapshot>(initialState: Snapshot): {
  snapshot: Snapshot;
  history: Snapshot[];
  push: (snapshot: Snapshot) => void;
  reset: (newInitialState: Snapshot) => void;
  travel: (i: number) => void;
  at: number;
} {
  const [history, setHistory] = useState<Snapshot[]>([initialState]);
  const [step, setStep] = useState(0);

  function push(snapshot: Snapshot) {
    setHistory(deepFreeze([...history.slice(0, step + 1), snapshot]));
    setStep(step + 1);
  }

  function reset(newInitialState: Snapshot) {
    setHistory([newInitialState]);
    setStep(0);
  }

  function travel(i: number) {
    setStep(i);
  }

  return { snapshot: history[step], history, push, reset, travel, at: step };
}
