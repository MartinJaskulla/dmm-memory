import { Effect } from '../effectMiddleware';
import { Move } from '../../features/useGame';

// Increases time limit between flips for the next three moves.

const EFFECT = 'timer';
const INCREASE_TIME_BY_SECONDS = 30;
const INCREASE_TIME_FOR_MOVES = 3;

export type TimerData = { [EFFECT]: number };

export const timerEffect: Effect<TimerData> = {
  effectId: EFFECT,
  card: {
    text: 'Timer',
  },
  middleware: {
    cardClick: (move: Move) => {
      move.effects.data[EFFECT] = INCREASE_TIME_FOR_MOVES;
      move.effects.dataEffects.push(EFFECT);
    },
    data: (move: Move<TimerData>) => {
      const cardHasCountdown = move.timeLimit > -1;
      if (!cardHasCountdown) return;

      // Increase time once
      if (move.effects.data[EFFECT] === INCREASE_TIME_FOR_MOVES) {
        move.timeLimit = move.timeLimit + INCREASE_TIME_BY_SECONDS;
      }

      // Decrement moves
      move.effects.data[EFFECT]--;

      // Decrease time after X + 1 moves
      if (move.effects.data[EFFECT] < 0) {
        // @ts-ignore
        delete move.effects.data[EFFECT];
        move.timeLimit = move.timeLimit - INCREASE_TIME_BY_SECONDS;
        // Consider the possibility of a timer penalty effect card:
        // Setting timeLimit to less than zero means there will be no countdown,
        // but the timer effect card should not be able to remove a countdown.
        // Setting it to zero means, the user looses the game, but this should be possible
        // if another effect reduces the timeLimit.
        move.timeLimit = move.timeLimit < 0 ? 0 : move.timeLimit;
      }
    },
  },
};
