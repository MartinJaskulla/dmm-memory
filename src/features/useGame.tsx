import React, { useEffect, useRef } from 'react';
import { fetchGoal } from '../api/fetchGoal';
import { History, useHistory } from './useHistory';
import { createGame } from '../api/createGame';
import { oneChoice, twoChoices, zeroChoices } from '../utils/choices';
import { useClock } from './useClock';
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

export interface Move<T extends Record<string, unknown> = Record<string, unknown>> {
  cards: Record<Id, GameCard>;
  cardIds: Id[];
  choice1: Id | null;
  choice2: Id | null;
  latestCard: Id;
  matched: Set<Id>;
  foundEffects: Set<Id>;
  gameOver: { win: boolean; reason: string } | null;
  totalMs: number;
  timeLimit: TimeLimit;
  effects: T;
}

const defaultMove: Move = {
  cards: {},
  cardIds: [],
  choice1: null, // TODO Also empty string?
  choice2: null,
  latestCard: '',
  matched: new Set(),
  foundEffects: new Set(),
  gameOver: null,
  totalMs: 0,
  timeLimit: -1,
  effects: {},
};

export interface GameValue {
  history: History<Move>;
  revealCard: (index: number) => void;
  seconds: number; // TODO Maybe not provided by game, but <Clock> which is placed in header???
}

const defaultGameValue: GameValue = {
  history: {
    move: defaultMove,
    moveIndex: 0,
    moves: [],
    addMove: () => null,
    goToMove: () => null,
    resetMoves: () => null,
  },
  seconds: -1,
  revealCard: () => null,
};

const GameContext = React.createContext<GameValue>(defaultGameValue);

interface GameProps {
  children: React.ReactNode;
  countdown: CountdownValue;
  effects: Effect[];
}

const GameProvider = ({ children, countdown, effects }: GameProps) => {
  const history = useHistory(defaultMove);
  const { move } = history;
  const clock = useClock();

  const lastMoveDateRef = useRef(new Date());
  useEffect(() => {
    // Could be late, but fair for the user to start counting after the browser has painted
    // TODO Can the displayed clock drift from this? I think so. Eveery time we push a move, we should also reset the clock to the move.totalMs
    lastMoveDateRef.current = new Date();
  }, [history.moveIndex]);

  function getMsSinceLastMove() {
    return new Date().getTime() - lastMoveDateRef.current.getTime();
  }

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
    saveMove({ gameOver: { win: false, reason } });
  }

  async function newGame() {
    const { goal_items } = await fetchGoal();
    const { cards, cardIds } = createGame(goal_items, effects, NUMBER_OF_PAIRS, NUMBER_OF_EFFECTS);
    // clock.setTime(new Date(0)); // TODO Clock
    history.resetMoves({ ...defaultMove, cards, cardIds });
  }

  function revealCard(revealedCardIndex: number) {
    const nextMove: Move = structuredClone(move);

    const cardId = move.cardIds[revealedCardIndex];
    nextMove.latestCard = cardId;

    const card = move.cards[cardId];
    flipCards(nextMove, card);

    saveMove(nextMove);
  }

  function saveMove(moveUpdates: Partial<Move>) {
    const nextMove: Move = merge(structuredClone(move), moveUpdates);
    nextMove.totalMs = getMsSinceLastMove() + history.moves[history.moveIndex].totalMs;
    checkWin(nextMove, NUMBER_OF_PAIRS);
    updateTimeLimit(nextMove, TIME_LIMIT);
    effectMiddleWare(effects, nextMove);
    history.addMove(nextMove);
  }

  useEffect(() => {
    countdown.restart(move.timeLimit);
    clock.restart(100);
    // clock.restart(history.move.date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.moveIndex]);

  useEffect(() => {
    if (countdown.remaining === 0) loose('Time is up! 😭');
    // Can't wait for useEvent: https://github.com/reactjs/rfcs/pull/220
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown.remaining]);

  useEffect(() => {
    if (move.gameOver) alert(move.gameOver.reason);
  }, [move.gameOver]);

  const gameValue: GameValue = {
    history,
    revealCard,
    seconds: clock.seconds,
  };

  return <GameContext.Provider value={gameValue}>{children}</GameContext.Provider>;
};

function useGame(): GameValue {
  return React.useContext(GameContext);
}

export function flipCards(nextMove: Move, card: GameCard): void {
  switch (card.type) {
    case 'matchable': {
      // Hide both cards, if two choices were already made. Don't do this for effects. Otherwise shuffle looks confusing.
      if (twoChoices(nextMove)) {
        nextMove.choice1 = null;
        nextMove.choice2 = null;
      }
      // Flip one card
      if (zeroChoices(nextMove)) {
        nextMove.choice1 = card.id;
      } else if (oneChoice(nextMove)) {
        nextMove.choice2 = card.id;
      }
      // Check for a match
      const card1 = nextMove.choice1 ? nextMove.cards[nextMove.choice1] : null;
      const card2 = nextMove.choice2 ? nextMove.cards[nextMove.choice2] : null;
      if (card1 && card2) {
        if (card1.type !== 'matchable' || card2.type !== 'matchable') {
          throw new Error('Only matchable cards should be choices');
        }
        if (card1.matchId === card2.matchId) {
          nextMove.matched.add(card1.id);
          nextMove.matched.add(card2.id);
          nextMove.choice1 = null;
          nextMove.choice2 = null;
        }
      }
      break;
    }
    case 'effect': {
      nextMove.foundEffects.add(card.id);
      break;
    }
  }
}

function checkWin(nextMove: Move, requiredPairs: number) {
  if (!nextMove.gameOver && nextMove.matched.size / 2 === requiredPairs) {
    nextMove.gameOver = { win: true, reason: 'You found all pairs! 🎉' };
  }
}

function updateTimeLimit(nextMove: Move, defaultTimeLimit: TimeLimit) {
  if (oneChoice(nextMove) || twoChoices(nextMove)) {
    nextMove.timeLimit = nextMove.timeLimit < 0 ? defaultTimeLimit : nextMove.timeLimit;
  }
  if (nextMove.gameOver) {
    nextMove.timeLimit = -1;
  }
}

export { GameProvider, useGame };
