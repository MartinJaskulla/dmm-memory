import { Effect } from '../effectMiddleware';
import { Snapshot } from '../../features/useGame';

// Increases time limit between flips for the next three moves.

const EFFECT = 'timer';
const INCREASE_TIME_LIMIT_BY = 30;

export type TimerData = { [EFFECT]: number };

export const timerEffect: Effect<TimerData> = {
  effect: EFFECT,
  card: {
    text: 'Timer',
  },
  middleware: {
    active: (snapshot: Snapshot) => {
      snapshot.effects[EFFECT] = 3;
      snapshot.timeLimit = snapshot.timeLimit + INCREASE_TIME_LIMIT_BY;
    },
    passive: (snapshot: Snapshot<TimerData>) => {
      snapshot.effects[EFFECT]--;
      if (snapshot.effects[EFFECT] === 0) {
        delete (snapshot as Snapshot).effects[EFFECT];
        snapshot.timeLimit = snapshot.timeLimit - INCREASE_TIME_LIMIT_BY;
        // Consider a different time penalty effect card
        snapshot.timeLimit = snapshot.timeLimit < 0 ? 0 : snapshot.timeLimit;
        // TODO Build general validation, that resets each property to the default value if invalid? Or depending on the invalidity
      }
    },
  },
};
