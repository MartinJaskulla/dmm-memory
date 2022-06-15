import { Effect } from '../effectMiddleware';
import { checkMatch, CardId, Move } from '../../features/useGame';
import { twoChoices } from '../../utils/choices';

// Retry — The next time you flip over a non-matching card, you get another chance (the first one stays flipped and the timer resets).

const EFFECT = 'retry';

export type RetryData = { retryCardId: CardId; choice1: Move['choice1']; choice2: Move['choice2'] };

export const retryEffect: Effect<RetryData> = {
  effectId: EFFECT,
  card: {
    text: 'Retry',
  },
  middleware: {
    cardClick: (move: Move<RetryData>, cardIdOfEffect) => {
      move.effects.data[cardIdOfEffect] = { retryCardId: move.latestCard, choice1: '', choice2: '' };
      move.effects.order.push([cardIdOfEffect, EFFECT]);
    },
    nextClick: (move: Move<RetryData>, cardIdOfEffect) => {
      const isEffectCard = move.foundEffects.has(move.latestCard);
      const isBeforeRetry = move.effects.data[cardIdOfEffect].choice1 === '';
      if (isBeforeRetry) {
        if (isEffectCard) return;
        const isMatch = move.matched.has(move.latestCard);
        if (!isMatch && twoChoices(move)) {
          move.disabled.add(move.choice1);
          move.disabled.add(move.choice2);
          move.highlights.add(move.choice1);
          move.highlights.add(move.effects.data[cardIdOfEffect].retryCardId);
          move.effects.data[cardIdOfEffect].choice1 = move.choice1;
          move.effects.data[cardIdOfEffect].choice2 = move.choice2;
        }
      } else {
        move.disabled.delete(move.effects.data[cardIdOfEffect].choice1);
        move.disabled.delete(move.effects.data[cardIdOfEffect].choice2);
        move.highlights.delete(move.effects.data[cardIdOfEffect].choice1);
        move.highlights.delete(move.effects.data[cardIdOfEffect].retryCardId);
        if (!isEffectCard) {
          move.choice2 = move.choice1;
          move.choice1 = move.effects.data[cardIdOfEffect].choice1;
          checkMatch(move);
        }
        delete move.effects.data[cardIdOfEffect];
      }
    },
  },
};
