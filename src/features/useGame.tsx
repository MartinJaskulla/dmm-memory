import React, { useEffect, useRef } from 'react';
import { fetchGoal, Language } from '../api/fetchGoal';
import { History, useHistory } from './useHistory';
import { createGame } from '../api/createGame';
import { oneChoice, twoChoices, zeroChoices } from '../utils/choices';
import { merge } from '../utils/merge';
import { effectMiddleWare } from '../effects/effectMiddleware';
import { Clock } from '../utils/clock';
import { getRemainingMs } from '../components/Countdown';

export const NO_COUNTDOWN = Infinity;

// TODO Put in config
const PAIRS = 3;
const HINT_CARDS = 20;
const NUMBER_OF_EFFECTS = 4;
const TIME_LIMIT = 30000;

export type CardId = string;
export type MatchId = number;
export type EffectId = string;

export interface GameCardMatchable {
  type: 'matchable';
  id: CardId;
  matchId: MatchId;
  text: string;
  language: Language;
}

export interface GameCardEffect {
  type: 'effect';
  id: CardId;
  effectId: EffectId;
  text: string;
}

export type GameCard = GameCardMatchable | GameCardEffect;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Move<T = any> {
  cards: Record<CardId, GameCard>;
  cardIds: CardId[];
  choice1: CardId;
  choice2: CardId;
  latestCard: CardId;
  matched: Set<CardId>;
  foundEffects: Set<CardId>;
  hints: Set<CardId>;
  highlights: Set<CardId>;
  disabled: Set<CardId>;
  gameOver: { win: boolean; reason: string } | null;
  totalMs: number;
  timeLimit: number;
  effects: {
    data: Record<CardId, T>;
    queue: [CardId, EffectId][];
  };
}

const defaultMove: Move = {
  cards: {},
  cardIds: [],
  choice1: '',
  choice2: '',
  latestCard: '',
  matched: new Set(),
  foundEffects: new Set(),
  hints: new Set(),
  highlights: new Set(),
  disabled: new Set(),
  gameOver: null,
  totalMs: 0,
  timeLimit: NO_COUNTDOWN,
  effects: {
    data: {},
    queue: [],
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

  useEffect(() => {
    if (move.gameOver) setTimeout(() => alert(move.gameOver?.reason), 100);
  }, [move.gameOver]);

  async function newGame() {
    const { goal_items } = await fetchGoal();
    const { cards, cardIds, hints } = createGame(goal_items, PAIRS, NUMBER_OF_EFFECTS, HINT_CARDS);
    history.resetMoves({ ...defaultMove, cards, cardIds, hints });
  }

  function revealCard(revealedCardIndex: number) {
    const nextMove: Move = structuredClone(move);

    const cardId = nextMove.cardIds[revealedCardIndex];
    const card = nextMove.cards[cardId];

    nextMove.totalMs = clockRef.current.ms;
    nextMove.latestCard = cardId;
    flipCards(nextMove, card);
    saveMove(nextMove);
  }

  function saveMove(moveUpdates: Partial<Move>) {
    const nextMove: Move = merge(structuredClone(move), moveUpdates);
    nextMove.hints = new Set();
    startFirstCountdown(nextMove, TIME_LIMIT);
    effectMiddleWare(nextMove);
    winIfAllPairsFound(nextMove, PAIRS);
    saveCountdownIfWon(nextMove, clockRef.current.ms, history.moves[history.moveIndex - 1]);
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
        nextMove.choice1 = '';
        nextMove.choice2 = '';
      }
      // Flip one card
      if (zeroChoices(nextMove)) {
        nextMove.choice1 = card.id;
      } else if (oneChoice(nextMove)) {
        nextMove.choice2 = card.id;
      }
      // Check for a match
      checkMatch(nextMove);
      break;
    }
    case 'effect': {
      nextMove.foundEffects.add(card.id);
      break;
    }
  }
}

export function checkMatch(nextMove: Move) {
  const card1 = nextMove.cards[nextMove.choice1];
  const card2 = nextMove.cards[nextMove.choice2];
  if (card1?.type === 'matchable' && card2?.type === 'matchable') {
    if (card1.matchId === card2.matchId) {
      nextMove.matched.add(card1.id);
      nextMove.matched.add(card2.id);
      nextMove.choice1 = '';
      nextMove.choice2 = '';
    }
  }
}

function startFirstCountdown(nextMove: Move, defaultTimeLimit: number) {
  if (oneChoice(nextMove) && nextMove.timeLimit === NO_COUNTDOWN) {
    nextMove.timeLimit = defaultTimeLimit;
  }
}

function winIfAllPairsFound(nextMove: Move, requiredPairs: number) {
  if (!nextMove.gameOver && nextMove.matched.size / 2 === requiredPairs) {
    nextMove.gameOver = { win: true, reason: 'You found all pairs! 🎉' };
  }
}

function saveCountdownIfWon(nextMove: Move, clockMs: number, previousMove?: Move) {
  if (nextMove.gameOver?.win && previousMove) {
    nextMove.timeLimit = getRemainingMs(clockMs, previousMove.totalMs, nextMove.timeLimit);
  }
}

export { GameProvider, useGame };
