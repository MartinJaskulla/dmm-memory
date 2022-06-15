import { Effect } from '../effectMiddleware';
import { Move, NO_COUNTDOWN } from '../../features/useGame';

// Timer — Increases time limit between flips for the next three moves.

const EFFECT = 'timer';
const TIME_INCREASE = 15000;
const MOVES = 3;

export type TimerData = { movesLeft: number };

export const timerEffect: Effect = {
  effectId: EFFECT,
  card: {
    text: 'Timer',
  },
  middleware: {
    cardClick: (move: Move<TimerData>, cardIdOfEffect) => {
      move.effects.data[cardIdOfEffect] = { movesLeft: MOVES };
      move.effects.order.push([cardIdOfEffect, EFFECT]);
    },
    nextClick: (move: Move<TimerData>, cardIdOfEffect) => {
      const cardHasCountdown = move.timeLimit !== NO_COUNTDOWN;
      if (!cardHasCountdown) return;

      const isFirstTime = move.effects.data[cardIdOfEffect].movesLeft === MOVES;
      if (isFirstTime) {
        move.timeLimit = move.timeLimit + TIME_INCREASE;
      }

      move.effects.data[cardIdOfEffect].movesLeft--;

      const oneMoveAfterTimerBonusIsGone = move.effects.data[cardIdOfEffect].movesLeft === -1;
      if (oneMoveAfterTimerBonusIsGone) {
        move.timeLimit = move.timeLimit - TIME_INCREASE;
        delete move.effects.data[cardIdOfEffect];
      }
    },
  },
};
