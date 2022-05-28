import React, { useEffect } from 'react';
import { useFetchCards } from '../utils/useFetchCards';
import { useHistory } from '../utils/useHistory';

export interface GameCardMatchable {
  type: 'matchable';
  id: number;
  text: string;
  language: 'en' | 'ja';
}

export interface GameCardEffect {
  type: 'effect';
  effect: 'timer' | 'shuffle' | 'retry' | 'trick';
}

export type GameCard = GameCardMatchable | GameCardEffect;

export type Index = number;
export type Id = number;

export interface Snapshot {
  choice1: Index | null;
  choice2: Index | null;
  matches: Set<Id>;
  foundEffects: Set<Index>;
  cards: GameCard[];
}

const defaultSnapshot: Snapshot = {
  cards: [],
  choice1: null,
  choice2: null,
  matches: new Set(),
  foundEffects: new Set(),
};

export type GameContextValue = Snapshot & {
  revealCard: (index: Index) => void;
};

const defaultGameContextValue: GameContextValue = {
  ...defaultSnapshot,
  revealCard: () => null,
};

const GameContext = React.createContext<GameContextValue>(defaultGameContextValue);

interface GameProviderProps {
  children: React.ReactNode;
}

const GameProvider = ({ children }: GameProviderProps) => {
  const [snapshot, save] = useHistory(defaultSnapshot);
  const apiCards = useFetchCards();
  // TODO Ugly, move save to useFetchCards?
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => (apiCards ? save({ ...snapshot, cards: apiCards }) : void 0), [apiCards]);

  function revealCard(index: number) {
    const type = snapshot.cards[index].type;
    const nextSnapshot: Snapshot = {
      cards: structuredClone(snapshot.cards),
      choice1: snapshot.choice1,
      choice2: snapshot.choice2,
      foundEffects: new Set(snapshot.foundEffects),
      matches: new Set(snapshot.matches),
    };

    // Get new choices
    if (typeof snapshot.choice1 === 'number' && typeof snapshot.choice2 === 'number') {
      nextSnapshot.choice1 = null;
      nextSnapshot.choice2 = null;
    }

    switch (type) {
      case 'matchable':
        if (nextSnapshot.choice1 === null) {
          nextSnapshot.choice1 = index;
        } else if (nextSnapshot.choice2 === null) {
          nextSnapshot.choice2 = index;
        }
        break;
      case 'effect': {
        nextSnapshot.foundEffects.add(index);
        break;
      }
    }

    // Check for matches
    if (typeof nextSnapshot.choice1 === 'number' && typeof nextSnapshot.choice2 === 'number') {
      const card1 = snapshot.cards[nextSnapshot.choice1];
      const card2 = snapshot.cards[nextSnapshot.choice2];
      if (card1.type !== 'matchable' || card2.type !== 'matchable')
        throw new Error('Only matchable cards should be choices');
      if (card1.id === card2.id) {
        nextSnapshot.matches.add(card1.id);
        nextSnapshot.choice1 = null;
        nextSnapshot.choice2 = null;
      }
    }
    save(nextSnapshot);
  }

  const providerValue: GameContextValue = {
    ...snapshot,
    revealCard,
  };

  return <GameContext.Provider value={providerValue}>{children}</GameContext.Provider>;
};

function useGame(): GameContextValue {
  return React.useContext(GameContext);
}

export { GameProvider, useGame };
