import { Effect } from '../effects';
import { Snapshot } from '../../features/useGame';
import { isObject } from '../../utils/isObject';
import { oneChoice } from '../../utils/choices';

// Increases time limit between flips for the next three moves.

const EFFECT = 'timer';
const INCREASE_TIME_LIMIT_BY = 30;

export const timerEffect: Effect = {
  effect: EFFECT,
  card: {
    text: 'Timer',
  },
  middleware: {
    active: (snapshot: Snapshot) => {
      const counter: TimerData[typeof EFFECT] = { counter: 3 };
      snapshot.effects[EFFECT] = counter;
      const increasedTimeLimit =
        typeof snapshot.timeLimit === 'number' ? snapshot.timeLimit + INCREASE_TIME_LIMIT_BY : snapshot.timeLimit;
      snapshot.timeLimit = increasedTimeLimit;
      return snapshot;
    },
    passive: (snapshot: Snapshot) => {
      if (hasTimerData(snapshot.effects)) {
        if (oneChoice(snapshot)) {
          snapshot.effects[EFFECT].counter--;
          if (snapshot.effects[EFFECT].counter === 0) {
            // @ts-ignore
            delete snapshot.effects[EFFECT];
            if (typeof snapshot.timeLimit === 'number') {
              const revertedTimeLimit = snapshot.timeLimit - INCREASE_TIME_LIMIT_BY;
              snapshot.timeLimit = revertedTimeLimit < 0 ? 0 : revertedTimeLimit;
            }
          }
        }
      }
      return snapshot;
    },
  },
};

interface TimerData {
  [EFFECT]: {
    counter: number;
  };
}

function hasTimerData(effectdata: unknown): effectdata is TimerData {
  return isObject(effectdata) && isObject(effectdata[EFFECT]) && typeof effectdata[EFFECT].counter === 'number';
}
