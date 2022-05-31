import { Effect } from '../effectMiddleware';
import { Snapshot } from '../../features/useGame';

// Increases time limit between flips for the next three moves.

const EFFECT = 'timer';
const INCREASE_TIME_BY_SECONDS = 30;
const INCREASE_TIME_FOR_MOVES = 3;

export type TimerData = { [EFFECT]: number };

export const timerEffect: Effect<TimerData> = {
  effect: EFFECT,
  card: {
    text: 'Timer',
  },
  middleware: {
    active: (snapshot: Snapshot) => {
      snapshot.effects[EFFECT] = INCREASE_TIME_FOR_MOVES;
    },
    passive: (snapshot: Snapshot<TimerData>) => {
      const cardHasCountdown = snapshot.timeLimit > -1;
      if (!cardHasCountdown) return;

      // Increase time once
      if (snapshot.effects[EFFECT] === INCREASE_TIME_FOR_MOVES) {
        snapshot.timeLimit = snapshot.timeLimit + INCREASE_TIME_BY_SECONDS;
      }

      // Decrement moves
      snapshot.effects[EFFECT]--;

      // Decrease time after X + 1 moves
      if (snapshot.effects[EFFECT] < 0) {
        delete (snapshot as Snapshot).effects[EFFECT];
        snapshot.timeLimit = snapshot.timeLimit - INCREASE_TIME_BY_SECONDS;
        // Consider the possibility of a timer penalty effect card:
        // Setting timeLimit to less than zero means there will be no countdown,
        // but the timer effect card should not be able to remove a countdown.
        // Setting it to zero means, the user looses the game, but this should be possible
        // if another effect reduces the timeLimit.
        snapshot.timeLimit = snapshot.timeLimit < 0 ? 0 : snapshot.timeLimit;
      }
    },
  },
};
