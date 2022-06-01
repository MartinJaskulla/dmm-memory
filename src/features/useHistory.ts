import { useEffect, useState } from 'react';
import { deepFreeze } from '../utils/deepFreeze';

export interface History<M> {
  move: M;
  moves: M[];
  moveIndex: number;
  addMove: (move: M) => void;
  resetMoves: (newInitialMove: M) => void;
  goToMove: (moveIndex: number) => void;
  timeTravels: number;
}

export function useHistory<M>(initialMove: M): History<M> {
  const [timeTravels, setTimeTravels] = useState(0);
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
    // The "timeTravels" property allows consumers to do something only when goToMove is called.
    // For example when the user clicks on the same moveIndex, they want to restart that move, so the clock should reset as well.
    // For that, a useEffect dependency in <Clock> needs to change, but moveIndex would not change when clicking same moveIndex.
    setTimeTravels(timeTravels + 1);
    setMoveIndex(moveIndex);
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
    timeTravels,
  };
}
