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

export type GameContextValue = Snapshot & {
  revealCard: (index: Index) => void;
};

const defaultValue: GameContextValue = {
  cards: [],
  choice1: null,
  choice2: null,
  matches: new Set(),
  foundEffects: new Set(),
  revealCard: () => null,
};

const GameContext = React.createContext<GameContextValue>(defaultValue);

interface GameProviderProps {
  children: React.ReactNode;
}

const GameProvider = ({ children }: GameProviderProps) => {
  const [snapshot, save] = useHistory();
  const { choice1, choice2, matches, foundEffects, cards } = snapshot;
  // TODO How to start new game?
  const [apiCards] = useFetchCards(defaultValue.cards);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => save({ ...snapshot, cards: apiCards }), [apiCards]);

  function revealCard(index: number) {
    const type = cards[index].type;
    const nextSnapshot: Snapshot = {
      cards: structuredClone(cards),
      choice1,
      choice2,
      foundEffects: new Set(foundEffects),
      matches: new Set(matches),
    };

    // Get new choices
    if (typeof choice1 === 'number' && typeof choice2 === 'number') {
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
      const card1 = cards[nextSnapshot.choice1];
      const card2 = cards[nextSnapshot.choice2];
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
    cards,
    choice1,
    choice2,
    matches,
    foundEffects,
    revealCard,
  };

  return <GameContext.Provider value={providerValue}>{children}</GameContext.Provider>;
};

function useGame(): GameContextValue {
  return React.useContext(GameContext);
}

export { GameProvider, useGame };
