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
const TIME_LIMIT = 30;

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
  timeLimit: TIME_LIMIT,
  effects: {},
};

export type GameValue = Snapshot & {
  revealCard: (index: number) => void;
  moves: number;
};

const defaultGameContextValue: GameValue = {
  ...defaultSnapshot,
  revealCard: () => null,
  moves: 0,
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
    const cardId = snapshot.cardIds[revealedCardIndex];
    const card = snapshot.cards[cardId];

    const nextSnapshot: Snapshot = structuredClone(snapshot);

    nextSnapshot.latestCard = cardId;
    flipCards(nextSnapshot, card);
    checkWin(nextSnapshot);
    restartCountdown(nextSnapshot, countdown);
    takeSnapshot(nextSnapshot);
  }

  function takeSnapshot(snapshotUpdates: Partial<Snapshot>) {
    const nextSnapshot: Snapshot = merge(structuredClone(snapshot), snapshotUpdates);
    nextSnapshot.timePlayed = clock.time;
    effectMiddleWare(effects, nextSnapshot);
    history.push(nextSnapshot);
  }

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
    revealCard,
    moves: history.history.length - 1,
  };

  return <GameContext.Provider value={gameValue}>{children}</GameContext.Provider>;
};

function useGame(): GameValue {
  return React.useContext(GameContext);
}

export function flipCards(snapshot: Snapshot, card: GameCard): void {
  switch (card.type) {
    case 'matchable': {
      // Hide both cards, if two choices were already made. Don't do this for effects. Otherwise shuffle looks confusing.
      if (twoChoices(snapshot)) {
        snapshot.choice1 = null;
        snapshot.choice2 = null;
      }
      // Flip one card
      if (zeroChoices(snapshot)) {
        snapshot.choice1 = card.id;
      } else if (oneChoice(snapshot)) {
        snapshot.choice2 = card.id;
      }
      // Check for a match
      const card1 = snapshot.choice1 ? snapshot.cards[snapshot.choice1] : null;
      const card2 = snapshot.choice2 ? snapshot.cards[snapshot.choice2] : null;
      if (card1 && card2) {
        if (card1.type !== 'matchable' || card2.type !== 'matchable') {
          throw new Error('Only matchable cards should be choices');
        }
        if (card1.matchId === card2.matchId) {
          snapshot.matched.add(card1.id);
          snapshot.matched.add(card2.id);
          snapshot.choice1 = null;
          snapshot.choice2 = null;
        }
      }
      break;
    }
    case 'effect': {
      snapshot.foundEffects.add(card.id);
      break;
    }
  }
}

function checkWin(nextSnapshot: Snapshot) {
  nextSnapshot.over =
    nextSnapshot.matched.size / 2 === NUMBER_OF_PAIRS ? { win: true, reason: 'You found all pairs! 🎉' } : null;
}

function restartCountdown(nextSnapshot: Snapshot, countdown: CountdownValue) {
  // Requirements:
  // - Once one non-effect (word) card is flipped, start a timer.
  // - Flipping over an effect card should reset the move timer.
  countdown.stop();
  if (oneChoice(nextSnapshot) || twoChoices(nextSnapshot)) {
    countdown.restart(nextSnapshot.timeLimit);
  }
}

export { GameProvider, useGame };
