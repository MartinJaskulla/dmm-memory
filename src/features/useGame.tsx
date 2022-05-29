import React, { useEffect } from 'react';
import { fetchGoal } from '../api/fetchGoal';
import { useHistory } from './useHistory';
import { goalToCards } from '../api/goalToCards';
import { useCountdown } from './useCountdown';
import { useGameClock } from './useGameClock';
import { effects } from '../effects/effects';

export type Id = string;
export type MatchId = number;

export interface GameCardMatchable {
  type: 'matchable';
  id: Id;
  matchId: MatchId;
  text: string;
  language: 'en' | 'ja';
}

export interface GameCardEffect {
  type: 'effect';
  id: Id;
  effect: string;
  text: string;
}
export type GameCard = GameCardMatchable | GameCardEffect;

export interface Snapshot {
  choice1: Id | null;
  choice2: Id | null;
  latestCard: Id | null;
  matches: Set<MatchId>;
  foundEffects: Set<Id>;
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
  revealCard: (index: number) => void;
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
  const history = useHistory(defaultSnapshot);
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
    const cards = goalToCards(goal, effects.effects);
    gameClock.setSeconds(0);
    history.reset({ ...defaultSnapshot, cards });
  }

  function revealCard(revealedCardIndex: number) {
    const nextSnapshot: Snapshot = structuredClone(snapshot);

    // Flip cards
    flipCards(nextSnapshot, revealedCardIndex);

    // Save revealed card
    nextSnapshot.latestCard = nextSnapshot.cards[revealedCardIndex].id;

    // Set countdown
    countdown.stop();
    const oneCardFlipped = typeof nextSnapshot.choice1 === 'string' && typeof nextSnapshot.choice2 !== 'string';
    if (oneCardFlipped) countdown.start(nextSnapshot.timeLimit);

    // Save current game time
    nextSnapshot.secondsPlayed = gameClock.seconds;

    // Add effects
    effects.middleware.history(nextSnapshot);

    // Save history
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

export function flipCards(snapshot: Snapshot, revealedCardIndex: number): void {
  const card = snapshot.cards[revealedCardIndex];

  switch (card.type) {
    case 'matchable':
      // Hide both cards, if two choices were already made
      if (typeof snapshot.choice1 === 'string' && typeof snapshot.choice2 === 'string') {
        snapshot.choice1 = null;
        snapshot.choice2 = null;
      }
      // Flip one card
      if (snapshot.choice1 === null) {
        snapshot.choice1 = card.id;
      } else if (snapshot.choice2 === null) {
        snapshot.choice2 = card.id;
      }
      break;
    case 'effect': {
      snapshot.foundEffects.add(card.id);
      break;
    }
  }

  // Check for a match
  const card1 = snapshot.cards.find((card) => card.id === snapshot.choice1);
  const card2 = snapshot.cards.find((card) => card.id === snapshot.choice2);
  if (card1 && card2) {
    if (card1.type !== 'matchable' || card2.type !== 'matchable') {
      throw new Error('Only matchable cards should be choices');
    }
    if (card1.matchId === card2.matchId) {
      snapshot.matches.add(card1.matchId);
      snapshot.choice1 = null;
      snapshot.choice2 = null;
    }
  }
}

export { GameProvider, useGame };
