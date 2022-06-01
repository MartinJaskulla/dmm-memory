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

  function goToMove(stepIndex: number) {
    setMoveIndex(stepIndex);
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
