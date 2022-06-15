import { Effect } from '../effectMiddleware';
import { checkMatch, CardId, Move } from '../../hooks/useGame';
import { twoChoices } from '../../utils/choices';

// Retry — The next time you flip over a non-matching card, you get another chance (the first one stays flipped and the timer resets).

const EFFECT = 'retry';

export type RetryData = { retryCardId: CardId; choice1: Move['choice1']; choice2: Move['choice2'] };

export const retryEffect: Effect = {
  effectId: EFFECT,
  card: {
    text: 'Retry',
  },
  middleware: {
    onClick: (move: Move<RetryData>, cardIdOfEffect) => {
      move.effects.data[cardIdOfEffect] = { retryCardId: move.latestCard, choice1: '', choice2: '' };
      move.effects.queue.push([cardIdOfEffect, EFFECT]);
    },
    onQueue: (move: Move<RetryData>, cardIdOfEffect) => {
      const otherRetriesQueued = move.effects.queue.find(([, effectId]) => effectId === EFFECT)?.[0] !== cardIdOfEffect;
      if (otherRetriesQueued) return;

      const isEffectCard = move.foundEffects.has(move.latestCard);
      const isBeforeRetry = move.effects.data[cardIdOfEffect].choice1 === '';
      if (isBeforeRetry) {
        if (isEffectCard) return;
        const isMatch = move.matched.has(move.latestCard);
        if (!isMatch && twoChoices(move)) {
          move.disabled.add(move.choice1);
          move.disabled.add(move.choice2);
          move.highlighted.add(move.choice2);
          move.highlighted.add(move.effects.data[cardIdOfEffect].retryCardId);
          move.effects.data[cardIdOfEffect].choice1 = move.choice1;
          move.effects.data[cardIdOfEffect].choice2 = move.choice2;
        }
      } else {
        move.disabled.delete(move.effects.data[cardIdOfEffect].choice1);
        move.disabled.delete(move.effects.data[cardIdOfEffect].choice2);
        move.highlighted.delete(move.effects.data[cardIdOfEffect].choice2);
        move.highlighted.delete(move.effects.data[cardIdOfEffect].retryCardId);
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
