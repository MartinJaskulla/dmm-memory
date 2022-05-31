import React, { useEffect } from 'react';
import { fetchGoal } from '../api/fetchGoal';
import { useHistory } from './useHistory';
import { createGame } from '../api/createGame';
import { oneChoice, twoChoices, zeroChoices } from '../utils/choices';
import { ClockUnit, ClockValue } from './useClock';
import { merge } from '../utils/merge';
import { CountdownValue } from './useCountdown';
import { Effect, effectMiddleWare } from '../effects/effectMiddleware';

const NUMBER_OF_PAIRS = 2;
const NUMBER_OF_EFFECTS = 2;
const TIME_LIMIT = 5;

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

export type TimeLimit = number;

export interface Snapshot<T extends Record<string, unknown> = Record<string, unknown>> {
  cards: Record<Id, GameCard>;
  cardIds: Id[];
  choice1: Id | null;
  choice2: Id | null;
  latestCard: Id;
  matched: Set<Id>;
  foundEffects: Set<Id>;
  over: { win: boolean; reason: string } | null;
  timePlayed: ClockUnit;
  timeLimit: TimeLimit;
  effects: T;
}

const defaultSnapshot: Snapshot = {
  cards: {},
  cardIds: [],
  choice1: null, // TODO Also empty string?
  choice2: null,
  latestCard: '',
  matched: new Set(),
  foundEffects: new Set(),
  over: null,
  timePlayed: new Date(0),
  timeLimit: -1,
  effects: {},
};

export type GameValue = Snapshot & {
  revealCard: (index: number) => void;
  moves: number;
  // TODO history needs to be a provider?
  history: ReturnType<typeof useHistory> | null;
};

const defaultGameContextValue: GameValue = {
  ...defaultSnapshot,
  revealCard: () => null,
  moves: 0,
  history: null,
};

const GameContext = React.createContext<GameValue>(defaultGameContextValue);

interface GameProps {
  children: React.ReactNode;
  clock: ClockValue;
  countdown: CountdownValue;
  effects: Effect[];
}

const GameProvider = ({ children, clock, countdown, effects }: GameProps) => {
  const history = useHistory(defaultSnapshot);
  const { snapshot } = history;

  // React 18 calls useEffect twice in StrictMode, which means we call newGame() twice on mount.
  // Using a ref or a global or local variable to check if the call was already made is not pleasing to the eye.
  // AbortController could also be used to cancel the first request, but in this small project I don't mind fetching goal.json twice.
  // In a bigger project I would use a state management library or, like Dan Abramov recommends, a fetching library:
  // https://github.com/facebook/react/issues/24502#issuecomment-1118867879
  useEffect(() => {
    newGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loose(reason: string) {
    takeSnapshot({ over: { win: false, reason } });
  }

  async function newGame() {
    const { goal_items } = await fetchGoal();
    const { cards, cardIds } = createGame(goal_items, effects, NUMBER_OF_PAIRS, NUMBER_OF_EFFECTS);
    clock.setTime(new Date(0));
    history.reset({ ...defaultSnapshot, cards, cardIds });
  }

  function revealCard(revealedCardIndex: number) {
    const nextSnapshot: Snapshot = structuredClone(snapshot);

    const cardId = snapshot.cardIds[revealedCardIndex];
    nextSnapshot.latestCard = cardId;

    const card = snapshot.cards[cardId];
    flipCards(nextSnapshot, card);

    takeSnapshot(nextSnapshot);
  }

  function takeSnapshot(snapshotUpdates: Partial<Snapshot>) {
    const nextSnapshot: Snapshot = merge(structuredClone(snapshot), snapshotUpdates);
    nextSnapshot.timePlayed = clock.time;
    updateTimeLimit(nextSnapshot, TIME_LIMIT);
    effectMiddleWare(effects, nextSnapshot);
    checkWin(nextSnapshot);
    history.push(nextSnapshot);
  }

  useEffect(() => {
    countdown.restart(snapshot.timeLimit);
    clock.setTime(snapshot.timePlayed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.at]);

  useEffect(() => {
    if (countdown.remaining === 0) loose('Time is up! 😭');
    // Can't wait for useEvent: https://github.com/reactjs/rfcs/pull/220
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown.remaining]);

  useEffect(() => {
    if (snapshot.over) alert(snapshot.over.reason);
  }, [snapshot.over]);

  const gameValue: GameValue = {
    ...snapshot,
    // @ts-ignore
    history,
    revealCard,
    moves: history.history.length - 1,
  };

  return <GameContext.Provider value={gameValue}>{children}</GameContext.Provider>;
};

function useGame(): GameValue {
  return React.useContext(GameContext);
}

export function flipCards(nextSnapshot: Snapshot, card: GameCard): void {
  switch (card.type) {
    case 'matchable': {
      // Hide both cards, if two choices were already made. Don't do this for effects. Otherwise shuffle looks confusing.
      if (twoChoices(nextSnapshot)) {
        nextSnapshot.choice1 = null;
        nextSnapshot.choice2 = null;
      }
      // Flip one card
      if (zeroChoices(nextSnapshot)) {
        nextSnapshot.choice1 = card.id;
      } else if (oneChoice(nextSnapshot)) {
        nextSnapshot.choice2 = card.id;
      }
      // Check for a match
      const card1 = nextSnapshot.choice1 ? nextSnapshot.cards[nextSnapshot.choice1] : null;
      const card2 = nextSnapshot.choice2 ? nextSnapshot.cards[nextSnapshot.choice2] : null;
      if (card1 && card2) {
        if (card1.type !== 'matchable' || card2.type !== 'matchable') {
          throw new Error('Only matchable cards should be choices');
        }
        if (card1.matchId === card2.matchId) {
          nextSnapshot.matched.add(card1.id);
          nextSnapshot.matched.add(card2.id);
          nextSnapshot.choice1 = null;
          nextSnapshot.choice2 = null;
        }
      }
      break;
    }
    case 'effect': {
      nextSnapshot.foundEffects.add(card.id);
      break;
    }
  }
}

function checkWin(nextSnapshot: Snapshot) {
  nextSnapshot.over =
    nextSnapshot.matched.size / 2 === NUMBER_OF_PAIRS ? { win: true, reason: 'You found all pairs! 🎉' } : null;
}

function updateTimeLimit(nextSnapshot: Snapshot, defaultTimeLimit: TimeLimit) {
  if (oneChoice(nextSnapshot) || twoChoices(nextSnapshot)) {
    nextSnapshot.timeLimit = nextSnapshot.timeLimit < 0 ? defaultTimeLimit : nextSnapshot.timeLimit;
  }
  // TODO effects could change game.over. I think a lot of checks have to run twice. once before effects, once after?
  //  or by effect themselves? obviously ugly and better approach needed
  if (nextSnapshot.over) {
    nextSnapshot.timeLimit = -1;
  }
}

export { GameProvider, useGame };
