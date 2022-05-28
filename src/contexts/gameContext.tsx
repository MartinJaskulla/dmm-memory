import React, { useEffect, useState } from 'react';
import { fetchGoal } from '../utils/fetchGoal';
import { useHistory } from '../utils/useHistory';
import { goalToCards } from '../utils/goalToCards';
import { useAnimationInterval } from '../utils/timer';

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
  seconds: number;
}

const defaultSnapshot: Snapshot = {
  cards: [],
  choice1: null,
  choice2: null,
  matches: new Set(),
  foundEffects: new Set(),
  seconds: 0,
};

export type GameContextValue = Snapshot & {
  revealCard: (index: Index) => void;
  newGame: () => void;
  moves: number;
  seconds: number;
};

const defaultGameContextValue: GameContextValue = {
  ...defaultSnapshot,
  revealCard: () => null,
  newGame: () => null,
  moves: 0,
  seconds: 0,
};

const GameContext = React.createContext<GameContextValue>(defaultGameContextValue);

interface GameProviderProps {
  children: React.ReactNode;
}

const GameProvider = ({ children }: GameProviderProps) => {
  // For time travel, destructure history and slice out the first snapshot (defaultSnapshot)
  const history = useHistory(defaultSnapshot);
  const { snapshot } = history;

  const [seconds, setSeconds] = useState(0);
  useAnimationInterval(1000, () => setSeconds((seconds) => seconds + 1));

  // React 18 calls useEffect twice in StrictMode, which means we call newGame() twice on mount.
  // Using a ref or a global or local variable to check if the call was already made is not pleasing to the eye.
  // AbortController could also be used to cancel the first request, but in this small project I don't mind fetching goal.json twice.
  // In a bigger project I would use a state management library or, like Dan Abramov recommends, a fetching library:
  // https://github.com/facebook/react/issues/24502#issuecomment-1118867879
  useEffect(() => {
    newGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function newGame() {
    const goal = await fetchGoal();
    const cards = goalToCards(goal);
    setSeconds(0);
    history.reset({ ...defaultSnapshot, cards });
  }

  function revealCard(index: number) {
    const type = snapshot.cards[index].type;
    const nextSnapshot: Snapshot = {
      cards: structuredClone(snapshot.cards),
      choice1: snapshot.choice1,
      choice2: snapshot.choice2,
      foundEffects: new Set(snapshot.foundEffects),
      matches: new Set(snapshot.matches),
      seconds,
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
    history.push(nextSnapshot);
  }

  const providerValue: GameContextValue = {
    ...snapshot,
    revealCard,
    newGame,
    moves: history.history.length - 1,
    seconds,
  };

  return <GameContext.Provider value={providerValue}>{children}</GameContext.Provider>;
};

function useGame(): GameContextValue {
  return React.useContext(GameContext);
}

export { GameProvider, useGame };
