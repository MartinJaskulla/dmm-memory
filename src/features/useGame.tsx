import React, { useEffect } from 'react';
import { fetchGoal } from '../api/fetchGoal';
import { useHistory } from './useHistory';
import { goalToCards } from '../api/goalToCards';
import { useCountdown } from './useCountdown';
import { useGameClock } from './useGameClock';
import { effects } from '../effects/effects';

export interface GameCardMatchable {
  type: 'matchable';
  id: number;
  text: string;
  language: 'en' | 'ja';
}

export interface GameCardEffect {
  type: 'effect';
  effect: string;
  text: string;
}

export type GameCard = GameCardMatchable | GameCardEffect;

export type Index = number;
export type Id = number;

export interface Snapshot {
  choice1: Index | null;
  choice2: Index | null;
  latestCard: number | null;
  matches: Set<Id>;
  foundEffects: Set<Index>;
  cards: GameCard[];
  secondsPlayed: number;
  timeLimit: number | null;
  effects: {
    [key: string]: unknown;
  };
}

const defaultSnapshot: Snapshot = {
  cards: [],
  choice1: null,
  choice2: null,
  latestCard: null,
  matches: new Set(),
  foundEffects: new Set(),
  secondsPlayed: 0,
  timeLimit: 10,
  effects: {},
};

export type GameContextValue = Snapshot & {
  revealCard: (index: Index) => void;
  newGame: () => void;
  moves: number;
};

const defaultGameContextValue: GameContextValue = {
  ...defaultSnapshot,
  revealCard: () => null,
  newGame: () => null,
  moves: 0,
  timeLimit: null,
};

const GameContext = React.createContext<GameContextValue>(defaultGameContextValue);

interface GameProviderProps {
  children: React.ReactNode;
}

const GameProvider = ({ children }: GameProviderProps) => {
  const history = useHistory(defaultSnapshot, effects.middleware.history);
  const { snapshot } = history;
  const gameClock = useGameClock();
  const countdown = useCountdown(() => {
    alert('Time is up!');
    newGame();
  });

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
    const cards = goalToCards(goal, effects.cards);
    gameClock.setSeconds(0);
    history.reset({ ...defaultSnapshot, cards });
  }

  function revealCard(revealedCardIndex: number) {
    // Flip cards
    const nextSnapshot = flipCards(snapshot, revealedCardIndex);

    // Save revealed card
    nextSnapshot.latestCard = revealedCardIndex;

    // Countdown
    countdown.stop();
    const oneCardFlipped = typeof nextSnapshot.choice1 === 'number' && typeof nextSnapshot.choice2 !== 'number';
    if (oneCardFlipped) countdown.start(nextSnapshot.timeLimit);

    // Game clock
    nextSnapshot.secondsPlayed = gameClock.seconds;

    history.push(nextSnapshot);
  }

  const value: GameContextValue = {
    ...snapshot,
    revealCard,
    newGame,
    moves: history.history.length - 1,
    timeLimit: countdown.seconds,
    secondsPlayed: gameClock.seconds,
  };

  const valueWithEffects = effects.middleware.game(value);

  return <GameContext.Provider value={valueWithEffects}>{children}</GameContext.Provider>;
};

function useGame(): GameContextValue {
  return React.useContext(GameContext);
}

export function flipCards(snapshot: Snapshot, revealedCardIndex: number): Snapshot {
  const nextSnapshot = structuredClone(snapshot);

  // Update choices
  if (typeof nextSnapshot.choice1 === 'number' && typeof nextSnapshot.choice2 === 'number') {
    nextSnapshot.choice1 = null;
    nextSnapshot.choice2 = null;
  }

  const revealedCardType = nextSnapshot.cards[revealedCardIndex].type;
  switch (revealedCardType) {
    case 'matchable':
      if (nextSnapshot.choice1 === null) {
        nextSnapshot.choice1 = revealedCardIndex;
      } else if (nextSnapshot.choice2 === null) {
        nextSnapshot.choice2 = revealedCardIndex;
      }
      break;
    case 'effect': {
      nextSnapshot.foundEffects.add(revealedCardIndex);
      break;
    }
  }

  // Update matches
  if (typeof nextSnapshot.choice1 === 'number' && typeof nextSnapshot.choice2 === 'number') {
    const card1 = nextSnapshot.cards[nextSnapshot.choice1];
    const card2 = nextSnapshot.cards[nextSnapshot.choice2];
    if (card1.type !== 'matchable' || card2.type !== 'matchable')
      throw new Error('Only matchable cards should be choices');
    if (card1.id === card2.id) {
      nextSnapshot.matches.add(card1.id);
      nextSnapshot.choice1 = null;
      nextSnapshot.choice2 = null;
    }
  }

  return nextSnapshot;
}

export { GameProvider, useGame };
