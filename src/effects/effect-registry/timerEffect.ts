import { Effect } from '../effects';
import { Snapshot } from '../../features/useGame';
import { isObject } from '../../utils/isObject';

// Increases time limit between flips for the next three moves.

const EFFECT = 'timer';
const INCREASE_TIME_LIMIT_BY = 30;

let originalTimeLimit: number | null | undefined;

export const timerEffect: Effect = {
  effect: EFFECT,
  card: {
    text: 'Timer',
  },
  middleware: {
    history: (snapshot: Snapshot) => {
      // Save original time limit
      if (typeof originalTimeLimit === 'undefined') originalTimeLimit = snapshot.timeLimit;

      // Change time limit
      if (EFFECT in snapshot.effects && isCounter(snapshot.effects[EFFECT])) {
        const onlyOneCardChosen = typeof snapshot.choice1 === 'string' && typeof snapshot.choice2 !== 'string';
        if (onlyOneCardChosen) {
          snapshot.effects[EFFECT].counter--;
          if (snapshot.effects[EFFECT].counter === 0) {
            delete snapshot.effects[EFFECT];
            snapshot.timeLimit = originalTimeLimit;
          }
        }
      } else {
        snapshot.effects[EFFECT] = { counter: 3 };
        snapshot.timeLimit = (snapshot.timeLimit || 0) + INCREASE_TIME_LIMIT_BY;
      }

      return snapshot;
    },
  },
};

interface Counter {
  counter: number;
}

function isCounter(effect: unknown): effect is Counter {
  return isObject(effect) && typeof effect['counter'] === 'number';
}
