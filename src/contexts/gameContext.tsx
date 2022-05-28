import React, { useEffect } from 'react';
import { fetchGoal } from '../utils/fetchGoal';
import { useHistory } from '../utils/useHistory';
import { goalToCards } from '../utils/goalToCards';
import { useCountdown } from '../utils/useCountdown';
import { useGameClock } from '../utils/useGameClock';

const COUNTDOWN_SECONDS = 10; // Trick will probably make this dynamic

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
}

const defaultSnapshot: Snapshot = {
  cards: [],
  choice1: null,
  choice2: null,
  matches: new Set(),
  foundEffects: new Set(),
  secondsPlayed: 0,
};

export type GameContextValue = Snapshot & {
  revealCard: (index: Index) => void;
  newGame: () => void;
  moves: number;
  countdown: number | null;
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
  const gameClock = useGameClock(0);
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
    const cards = goalToCards(goal);
    gameClock.setSeconds(0);
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
      secondsPlayed: gameClock.seconds,
    };

    // Get new choices
    if (typeof snapshot.choice1 === 'number' && typeof snapshot.choice2 === 'number') {
      nextSnapshot.choice1 = null;
      nextSnapshot.choice2 = null;
    }

    switch (type) {
      case 'matchable':
        countdown.stop();
        if (nextSnapshot.choice1 === null) {
          nextSnapshot.choice1 = index;
          countdown.start(COUNTDOWN_SECONDS);
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
    // Overwriting snapshot.secondsPlayed, which is only updated per move
    secondsPlayed: gameClock.seconds,
    revealCard,
    newGame,
    moves: history.history.length - 1,
    countdown: countdown.seconds,
  };

  return <GameContext.Provider value={providerValue}>{children}</GameContext.Provider>;
};

function useGame(): GameContextValue {
  return React.useContext(GameContext);
}

export { GameProvider, useGame };
