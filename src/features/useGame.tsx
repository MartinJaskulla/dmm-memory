import React, { useEffect } from 'react';
import { fetchGoal } from '../api/fetchGoal';
import { useHistory } from './useHistory';
import { createGame } from '../api/createGame';
import { effects } from '../effects/effects';
import { oneChoice, twoChoices, zeroChoices } from '../utils/choices';
import { ClockUnit, ClockValue } from './useClock';
import { merge } from '../utils/merge';

const NUMBER_OF_PAIRS = 4;
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

export type TimeLimit = number | null;

export interface Snapshot {
  cards: Record<Id, GameCard>;
  cardIds: Id[];
  choice1: Id | null;
  choice2: Id | null;
  latestCard: Id | null;
  matched: Set<Id>;
  foundEffects: Set<Id>;
  over: { win: boolean; reason: string } | null;
  timePlayed: ClockUnit;
  timeLimit: TimeLimit;
  effects: {
    [key: string]: unknown;
  };
}

const defaultSnapshot: Snapshot = {
  cards: {},
  cardIds: [],
  choice1: null,
  choice2: null,
  latestCard: null,
  matched: new Set(),
  foundEffects: new Set(),
  over: null,
  timePlayed: new Date(0),
  timeLimit: TIME_LIMIT,
  effects: {},
};

export type GameValue = Snapshot & {
  revealCard: (index: number) => void;
  loose: (reason: string) => void;
  moves: number;
};

const defaultGameContextValue: GameValue = {
  ...defaultSnapshot,
  revealCard: () => null,
  loose: () => null,
  moves: 0,
};

const GameContext = React.createContext<GameValue>(defaultGameContextValue);

interface GameProps {
  children: React.ReactNode;
  clock: ClockValue;
}

const GameProvider = ({ children, clock }: GameProps) => {
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
    const goal = await fetchGoal();
    const { cards, cardIds } = createGame(goal, effects.effects, NUMBER_OF_PAIRS, NUMBER_OF_EFFECTS);
    clock.setTime(new Date(0));
    history.reset({ ...defaultSnapshot, cards, cardIds });
  }

  function revealCard(revealedCardIndex: number) {
    const cardId = snapshot.cardIds[revealedCardIndex];
    const snapshotUpdates: FlippedCards & Partial<Snapshot> = flipCards(snapshot, snapshot.cards[cardId]);
    // Check for win after flipping cards
    snapshotUpdates.over =
      snapshotUpdates.matched.size / 2 === NUMBER_OF_PAIRS ? { win: true, reason: 'You found all pairs! 🎉' } : null;
    snapshotUpdates.latestCard = cardId;
    takeSnapshot(snapshotUpdates);
  }

  function takeSnapshot(snapshotUpdates: Partial<Snapshot>) {
    const nextSnapshot: Snapshot = merge(structuredClone(snapshot), snapshotUpdates);
    nextSnapshot.timePlayed = clock.time;
    effects.middleware.history(nextSnapshot);
    history.push(nextSnapshot);
  }

  const gameValue: GameValue = {
    ...snapshot,
    revealCard,
    loose,
    moves: history.history.length - 1,
  };

  // TODO Delete
  const gameValueAfterEffects = effects.middleware.game(gameValue);

  return <GameContext.Provider value={gameValueAfterEffects}>{children}</GameContext.Provider>;
};

function useGame(): GameValue {
  return React.useContext(GameContext);
}

type FlippedCards = Pick<Snapshot, 'choice1' | 'choice2' | 'matched' | 'foundEffects'>;
export function flipCards(snapshot: Snapshot, card: GameCard): FlippedCards {
  const updates: FlippedCards = {
    choice1: snapshot.choice1,
    choice2: snapshot.choice2,
    foundEffects: new Set(snapshot.foundEffects),
    matched: new Set(snapshot.matched),
  };

  switch (card.type) {
    case 'matchable': {
      // Hide both cards, if two choices were already made
      if (twoChoices(updates)) {
        updates.choice1 = null;
        updates.choice2 = null;
      }
      // Flip one card
      if (zeroChoices(updates)) {
        updates.choice1 = card.id;
      } else if (oneChoice(updates)) {
        updates.choice2 = card.id;
      }
      // Check for a match
      const card1 = updates.choice1 ? snapshot.cards[updates.choice1] : null;
      const card2 = updates.choice2 ? snapshot.cards[updates.choice2] : null;
      if (card1 && card2) {
        if (card1.type !== 'matchable' || card2.type !== 'matchable') {
          throw new Error('Only matchable cards should be choices');
        }
        if (card1.matchId === card2.matchId) {
          updates.matched.add(card1.id);
          updates.matched.add(card2.id);
          updates.choice1 = null;
          updates.choice2 = null;
        }
      }
      break;
    }
    case 'effect': {
      updates.foundEffects.add(card.id);
      break;
    }
  }

  return updates;
}

export { GameProvider, useGame };
