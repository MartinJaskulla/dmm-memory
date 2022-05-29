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
    history: (snapshot: Snapshot) => {
      // Change time limit
      if (EFFECT in snapshot.effects && isCounter(snapshot.effects[EFFECT])) {
        if (oneChoice(snapshot)) {
          snapshot.effects[EFFECT].counter--;
          if (snapshot.effects[EFFECT].counter === 0) {
            delete snapshot.effects[EFFECT];
            if (typeof snapshot.timeLimit === 'number') {
              const revertedTimeLimit = snapshot.timeLimit - INCREASE_TIME_LIMIT_BY;
              snapshot.timeLimit = revertedTimeLimit < 0 ? 0 : revertedTimeLimit;
            }
          }
        }
      } else {
        const timerEffect: Timer = { counter: 3 };
        snapshot.effects[EFFECT] = timerEffect;
        const increasedTimeLimit =
          typeof snapshot.timeLimit === 'number' ? snapshot.timeLimit + INCREASE_TIME_LIMIT_BY : snapshot.timeLimit;
        snapshot.timeLimit = increasedTimeLimit;
      }

      return snapshot;
    },
  },
};

interface Timer {
  counter: number;
}

function isCounter(effect: unknown): effect is Timer {
  return isObject(effect) && typeof effect['counter'] === 'number';
}
