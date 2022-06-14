import { Effect } from '../effectMiddleware';
import { Move, NO_COUNTDOWN } from '../../features/useGame';

// Increases time limit between flips for the next three moves.

const EFFECT = 'timer';
const TIME_INCREASE = 30;
const MOVES = 3;

export type TimerData = { [EFFECT]: { movesLeft: number } };

export const timerEffect: Effect<TimerData> = {
  effectId: EFFECT,
  card: {
    text: 'Timer',
  },
  middleware: {
    cardClick: (move: Move) => {
      move.effects.data[EFFECT] = { movesLeft: MOVES };
      move.effects.dataEffects.push(EFFECT);
    },
    data: (move: Move<TimerData>) => {
      const cardHasCountdown = move.timeLimit !== NO_COUNTDOWN;
      if (!cardHasCountdown) return;

      // Increase time once
      const firstTime = move.effects.data[EFFECT].movesLeft === MOVES;
      if (firstTime) {
        move.timeLimit = move.timeLimit + TIME_INCREASE;
      }

      move.effects.data[EFFECT].movesLeft--;

      const oneMoveAfterTimerBonusIsGone = move.effects.data[EFFECT].movesLeft === -1;
      if (oneMoveAfterTimerBonusIsGone) {
        // @ts-ignore
        delete move.effects.data[EFFECT];
        move.timeLimit = move.timeLimit - TIME_INCREASE;
        // Consider the possibility of a timer penalty effect card:
        // Setting timeLimit to less than zero means there will be no countdown,
        // but the timer effect card should not be able to remove a countdown (by setting to -1).
        // Setting it to zero means, the user looses the game, but this should be possible
        // if another effect reduces the timeLimit.
        move.timeLimit = move.timeLimit < 0 ? 0 : move.timeLimit;
      }
    },
  },
};
