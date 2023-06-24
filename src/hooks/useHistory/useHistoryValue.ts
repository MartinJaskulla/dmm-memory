import { useEffect, useState } from 'react';
import { deepFreeze } from '../../utils/deepFreeze';
import { GameOver } from '../../config/gameOver';
import { Language } from '../../api/fetchGoal';

export const NO_COUNTDOWN = Infinity;

export type CardId = string;
export type MatchId = number;
export type EffectId = string;

export interface GameCardMatchable {
  type: 'matchable';
  cardId: CardId;
  matchId: MatchId;
  text: string;
  language: Language;
}

export interface GameCardEffect {
  type: 'effect';
  cardId: CardId;
  effectId: EffectId;
  text: string;
}

export type GameCard = GameCardMatchable | GameCardEffect;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Move<DataValue = any> {
  cards: Record<CardId, GameCard>;
  cardIds: CardId[];
  choice1: CardId;
  choice2: CardId;
  latestCard: CardId;
  foundEffects: Set<CardId>;
  matched: Set<CardId>;
  hinted: Set<CardId>;
  highlighted: Set<CardId>;
  gameOver: GameOver | null;
  msPlayed: number;
  msPerMove: number;
  effects: {
    data: Record<CardId, DataValue>;
    queue: [CardId, EffectId][];
  };
}

const defaultMove: Move = {
  cards: {},
  cardIds: [],
  choice1: '',
  choice2: '',
  latestCard: '',
  foundEffects: new Set(),
  matched: new Set(),
  hinted: new Set(),
  highlighted: new Set(),
  gameOver: null,
  msPlayed: 0,
  msPerMove: NO_COUNTDOWN,
  effects: {
    data: {},
    queue: [],
  },
};

export interface History {
  move: Move;
  moves: Move[];
  moveIndex: number;
  addMove: (move: Partial<Move>) => void;
  resetMoves: (newInitialMove: Partial<Move>) => void;
  goToMove: (moveIndex: number) => void;
}

export function useHistoryValue(initialMove = defaultMove): History {
  const [moves, setMoves] = useState<Move[]>([initialMove]);
  const [moveIndex, setMoveIndex] = useState(0);
  const move = moves[moveIndex];

  function addMove(nextMove: Partial<Move>) {
    const nextMoveFull: Move = { ...structuredClone(move), ...nextMove };
    setMoves(deepFreeze([...moves.slice(0, moveIndex + 1), nextMoveFull]));
    setMoveIndex(moveIndex + 1);
  }

  function resetMoves(newInitialMove: Partial<Move>) {
    setMoves([{ ...defaultMove, ...newInitialMove }]);
    setMoveIndex(0);
  }

  function goToMove(moveIndex: number) {
    setMoveIndex(moveIndex);
    // Changing the reference of "move", so that "move" triggers useEffect dependency arrays, because primitive types
    // such as moveIndex cannot do that. This is used e.g. when restarting the same move via time travel.
    setMoves(deepFreeze(structuredClone(moves)));
  }

  useEffect(() => {
    console.log(moves);
  }, [moves]);

  return {
    move,
    moves,
    addMove,
    resetMoves,
    goToMove,
    moveIndex,
  };
}
