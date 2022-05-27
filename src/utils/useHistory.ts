import { useState } from 'react';

export function useHistory<Snapshot>(initialState: Snapshot): [Snapshot, (snapshot: Snapshot) => void] {
  const [history, setHistory] = useState<Snapshot[]>([initialState]);
  const [step, setStep] = useState(0);

  const save = (snapshot: Snapshot) => {
    setHistory([...history, snapshot]);
    setStep(step + 1);
  };

  return [history[step], save];
}
