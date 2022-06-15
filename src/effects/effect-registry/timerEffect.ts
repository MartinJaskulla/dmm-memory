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
    onClick: (move: Move<TimerData>, cardIdOfEffect) => {
      move.effects.data[cardIdOfEffect] = { movesLeft: MOVES };
      move.effects.queue.push([cardIdOfEffect, EFFECT]);
    },
    onQueue: (move: Move<TimerData>, cardIdOfEffect) => {
      const cardHasCountdown = move.msPerMove !== NO_COUNTDOWN;
      if (!cardHasCountdown) return;

      const isFirstTime = move.effects.data[cardIdOfEffect].movesLeft === MOVES;
      if (isFirstTime) {
        move.msPerMove = move.msPerMove + TIME_INCREASE;
      }

      move.effects.data[cardIdOfEffect].movesLeft--;

      const oneMoveAfterTimerBonusIsGone = move.effects.data[cardIdOfEffect].movesLeft === -1;
      if (oneMoveAfterTimerBonusIsGone) {
        move.msPerMove = move.msPerMove - TIME_INCREASE;
        delete move.effects.data[cardIdOfEffect];
      }
    },
  },
};
