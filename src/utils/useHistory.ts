import { Id, Index, Snapshot } from '../contexts/gameContext';
import { useState } from 'react';

type Save = (snapshot: Snapshot) => void;

export function useHistory(): [Snapshot, Save] {
  // History should not fetch cards
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [step, setStep] = useState(-1);

  const save: Save = (snapshot: Snapshot) => {
    setHistory([...history, snapshot]);
    setStep(step + 1);
  };

  const fallback: Snapshot = {
    cards: [],
    choice1: null,
    choice2: null,
    foundEffects: new Set<Index>(),
    matches: new Set<Id>(),
  };

  return [history[step] || fallback, save];
}
