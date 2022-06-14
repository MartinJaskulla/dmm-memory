import React, { useDeferredValue, useEffect, useRef } from 'react';
import { fetchGoal } from '../api/fetchGoal';
import { History, useHistory } from './useHistory';
import { createGame } from '../api/createGame';
import { oneChoice, twoChoices, zeroChoices } from '../utils/choices';
import { merge } from '../utils/merge';
import { effectMiddleWare } from '../effects/effectMiddleware';
import { EffectData } from '../effects/effect-registry/effectRegistry';
import { Clock } from '../utils/clock';

export const NO_COUNTDOWN = Infinity;

// TODO Put in config
const PAIRS = 1;
const HINT_CARDS = 20;
const NUMBER_OF_EFFECTS = 2;
const TIME_LIMIT = 2;

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
  effectId: string;
  text: string;
}
export type GameCard = GameCardMatchable | GameCardEffect;

export interface Move<T extends EffectData = EffectData> {
  cards: Record<Id, GameCard>;
  cardIds: Id[];
  choice1: Id | null;
  choice2: Id | null;
  latestCard: Id;
  matched: Set<Id>;
  foundEffects: Set<Id>;
  hints: Set<Id>;
  gameOver: { win: boolean; reason: string } | null;
  totalMs: number;
  timeLimit: number;
  effects: {
    data: T;
    dataEffects: string[]; // I think this allows stacking effects and maybe even doubling if I change e.g. timerEffect to always subtract time after countre is zero?
    // don't always call each effect for example, justshift effectOrder Hmm. So either 2d array or don't shift and passive effect itself needs to remove it from effectOrder?
    // If there are multiple times in the order, how would a passive effect know which one to remove?
  };
}

const defaultMove: Move = {
  cards: {},
  cardIds: [],
  choice1: null, // TODO Also empty string?
  choice2: null,
  latestCard: '',
  matched: new Set(),
  foundEffects: new Set(),
  hints: new Set(),
  gameOver: null,
  totalMs: 0,
  timeLimit: NO_COUNTDOWN,
  effects: {
    data: {} as EffectData,
    dataEffects: [],
  },
};

export interface GameValue {
  move: History<Move>['move'];
  moves: History<Move>['moves'];
  moveIndex: History<Move>['moveIndex'];
  goToMove: History<Move>['goToMove'];
  // Do not provide ms directly via setState, because we don't want to re-render all children of <GameProvider> every 10ms
  subscribeToClock: typeof Clock['prototype']['subscribe'];
  revealCard: (index: number) => void;
  saveMove: (moveUpdates: Partial<Move>) => void;
}

const defaultGameValue: GameValue = {
  move: defaultMove,
  moves: [],
  moveIndex: 0,
  goToMove: () => null,
  subscribeToClock: () => () => null,
  revealCard: () => null,
  saveMove: () => null,
};

const GameContext = React.createContext<GameValue>(defaultGameValue);

interface GameProps {
  children: React.ReactNode;
}

const GameProvider = ({ children }: GameProps) => {
  const clockRef = useRef(new Clock());
  const history = useHistory(defaultMove);
  const move = history.move;

  // React 18 calls useEffect twice in StrictMode, which means we call newGame() twice on mount.
  // Using a ref or a global or local variable to check if the call was already made is not pleasing to the eye.
  // AbortController could also be used to cancel the first request, but in this small project I don't mind fetching goal.json twice.
  // https://jherr2020.medium.com/react-18-useeffect-double-call-for-apis-emergency-fix-724b7ee6a646
  // In a bigger project I would use a state management library or, like Dan Abramov recommends, a fetching library:
  // https://github.com/facebook/react/issues/24502#issuecomment-1118867879
  useEffect(() => {
    newGame();
  }, []);

  // Allow game clock to paint. Needed for when the user has won.
  // Otherwise the clock will show the 2nd last time while the alert is open
  // and only paint the final time after the alert is closed.
  const deferredGameOver = useDeferredValue(move.gameOver);
  useEffect(() => {
    if (deferredGameOver) alert(deferredGameOver.reason);
  }, [deferredGameOver]);

  async function newGame() {
    const { goal_items } = await fetchGoal();
    const { cards, cardIds, hints } = createGame(goal_items, PAIRS, NUMBER_OF_EFFECTS, HINT_CARDS);
    history.resetMoves({ ...defaultMove, cards, cardIds, hints });
  }

  function revealCard(revealedCardIndex: number) {
    const nextMove: Move = structuredClone(move);
    nextMove.totalMs = clockRef.current.ms;

    const cardId = nextMove.cardIds[revealedCardIndex];
    nextMove.latestCard = cardId;

    const card = nextMove.cards[cardId];
    flipCards(nextMove, card);

    saveMove(nextMove);
  }

  function saveMove(moveUpdates: Partial<Move>) {
    const nextMove: Move = merge(structuredClone(move), moveUpdates);
    // Remove hints before effectMiddleware, so that effects can add hints
    nextMove.hints = new Set();
    checkWin(nextMove, PAIRS);
    updateTimeLimit(nextMove, TIME_LIMIT);
    effectMiddleWare(nextMove);
    history.addMove(nextMove);
  }

  useEffect(() => {
    clockRef.current.stop();
    if (!move.gameOver) clockRef.current.start(move.totalMs);
  }, [move]);

  const gameValue: GameValue = {
    moves: history.moves,
    move: history.move,
    moveIndex: history.moveIndex,
    goToMove: history.goToMove,
    revealCard,
    saveMove,
    subscribeToClock: clockRef.current.subscribe,
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

function updateTimeLimit(nextMove: Move, defaultTimeLimit: number) {
  if (oneChoice(nextMove) || twoChoices(nextMove)) {
    nextMove.timeLimit = nextMove.timeLimit === NO_COUNTDOWN ? defaultTimeLimit : nextMove.timeLimit;
  }
  if (nextMove.gameOver) {
    nextMove.timeLimit = NO_COUNTDOWN;
  }
}

export { GameProvider, useGame };
