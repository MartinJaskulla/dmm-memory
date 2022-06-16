import { Effect } from '../effectMiddleware';
import { Move, NO_COUNTDOWN } from '../../hooks/useHistory/useHistoryValue';

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
    onClick: (nextMove: Move<TimerData>, cardIdOfEffect) => {
      nextMove.effects.data[cardIdOfEffect] = { movesLeft: MOVES };
      nextMove.effects.queue.push([cardIdOfEffect, EFFECT]);
    },
    onQueue: (nextMove: Move<TimerData>, cardIdOfEffect) => {
      const cardHasCountdown = nextMove.msPerMove !== NO_COUNTDOWN;
      if (!cardHasCountdown) return;

      const isFirstTime = nextMove.effects.data[cardIdOfEffect].movesLeft === MOVES;
      if (isFirstTime) {
        nextMove.msPerMove = nextMove.msPerMove + TIME_INCREASE;
      }

      nextMove.effects.data[cardIdOfEffect].movesLeft--;

      const oneMoveAfterTimerBonusIsGone = nextMove.effects.data[cardIdOfEffect].movesLeft === -1;
      if (oneMoveAfterTimerBonusIsGone) {
        nextMove.msPerMove = nextMove.msPerMove - TIME_INCREASE;
        delete nextMove.effects.data[cardIdOfEffect];
      }
    },
  },
};
