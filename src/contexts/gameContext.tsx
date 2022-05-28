import React, { useEffect } from 'react';
import { fetchGoal } from '../utils/fetchGoal';
import { useHistory } from '../utils/useHistory';
import { goalToCards } from '../utils/goalToCards';
import { useCountdown } from '../utils/useCountdown';
import { useGameClock } from '../utils/useGameClock';
import { flipCards } from './flipCards';
import { useEverySecond } from '../utils/timer';

/*
 TODO Each effect can
 - Register sth to run each second
 - middleware nextSnapshot
 - middleware contextValue
 - register an effect card (just the card, for its functionality use the middleware)

 addEffect((registry) => {
  registry.addEffectCard()
 })

 Maybe regular rules like flipCard should not be an effect. Countdown should be? The countdown could still call a function?
 Maybe countdown should not be an effect. Game clock as well

 addEffectCard({
    middleware1,
    middleware2,
    card: {text, type}
 })
 */

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
  secondsPlayed: number;
  countdown: number | null;
  effects: {
    [key: string]: unknown;
  };
}

const defaultSnapshot: Snapshot = {
  cards: [],
  choice1: null,
  choice2: null,
  matches: new Set(),
  foundEffects: new Set(),
  secondsPlayed: 0,
  countdown: 10,
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
  countdown: null,
};

const GameContext = React.createContext<GameContextValue>(defaultGameContextValue);

interface GameProviderProps {
  children: React.ReactNode;
}

const GameProvider = ({ children }: GameProviderProps) => {
  const history = useHistory(defaultSnapshot);
  const { snapshot } = history;
  const gameClock = useGameClock();
  const countdown = useCountdown(() => {
    alert('Time is up!');
    newGame();
  });

  // Batched together so that both timers update at the same time visually
  useEverySecond(() => {
    gameClock.increment();
    countdown.decrement();
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
    const cards = goalToCards(goal);
    gameClock.setSeconds(0);
    history.reset({ ...defaultSnapshot, cards });
  }

  function revealCard(revealedCardIndex: number) {
    const nextSnapshot = flipCards(snapshot, revealedCardIndex);
    nextSnapshot.secondsPlayed = gameClock.seconds;
    countdown.stop();
    if (
      typeof nextSnapshot.choice1 === 'number' &&
      typeof nextSnapshot.choice2 !== 'number' &&
      nextSnapshot.countdown
    ) {
      countdown.start(nextSnapshot.countdown);
    }
    history.push(nextSnapshot);
  }

  const providerValue: GameContextValue = {
    ...snapshot,
    revealCard,
    newGame,
    moves: history.history.length - 1,
    countdown: countdown.seconds,
    secondsPlayed: gameClock.seconds,
  };

  return <GameContext.Provider value={providerValue}>{children}</GameContext.Provider>;
};

function useGame(): GameContextValue {
  return React.useContext(GameContext);
}

export { GameProvider, useGame };
