import { useEffect, useState } from 'react';
import { deepFreeze } from '../utils/deepFreeze';

export interface History<M> {
  move: M;
  moves: M[];
  moveIndex: number;
  addMove: (move: M) => void;
  resetMoves: (newInitialMove: M) => void;
  goToMove: (moveIndex: number) => void;
}

export function useHistory<M>(initialMove: M): History<M> {
  const [moves, setMoves] = useState<M[]>([initialMove]);
  const [moveIndex, setMoveIndex] = useState(0);

  function addMove(nextStep: M) {
    setMoves(deepFreeze([...moves.slice(0, moveIndex + 1), nextStep]));
    setMoveIndex(moveIndex + 1);
  }

  function resetMoves(newInitialStep: M) {
    setMoves([newInitialStep]);
    setMoveIndex(0);
  }

  function goToMove(moveIndex: number) {
    setMoveIndex(moveIndex);
    // Changing the reference of "move", so that "move" triggers a useEffect dependency array even if the moveIndex stays the same
    setMoves([
      ...moves.slice(0, moveIndex),
      structuredClone(moves[moveIndex]),
      ...moves.slice(moveIndex + 1, moves.length),
    ]);
  }

  useEffect(() => {
    console.log(moves);
  }, [moves]);

  return {
    move: moves[moveIndex],
    moves,
    addMove,
    resetMoves,
    goToMove,
    moveIndex,
  };
}
