import { useState } from 'react';

export function useHistory<Snapshot>(initialState: Snapshot): {
  snapshot: Snapshot;
  history: Snapshot[];
  push: (snapshot: Snapshot) => void;
  reset: (newInitialState: Snapshot) => void;
} {
  const [history, setHistory] = useState<Snapshot[]>([initialState]);
  const [step, setStep] = useState(0);

  function push(snapshot: Snapshot) {
    setHistory([...history, snapshot]);
    setStep(step + 1);
    console.log([...history, snapshot]);
  }

  function reset(newInitialState: Snapshot) {
    setHistory([newInitialState]);
    setStep(0);
  }

  return { snapshot: history[step], history, push, reset };
}
