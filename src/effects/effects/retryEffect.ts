import { Effect } from '../effectMiddleware';
import { checkMatch, Move } from '../../hooks/useGame';
import { twoChoices } from '../../utils/choices';

// Retry — The next time you flip over a non-matching card, you get another chance (the first one stays flipped and the timer resets).

const EFFECT = 'retry';

// Storing move, because it is easier than finding the previous move when time traveling
export type RetryData = { choice1: Move['choice1']; choice2: Move['choice2'] };

export const retryEffect: Effect = {
  effectId: EFFECT,
  card: {
    text: 'Retry',
  },
  middleware: {
    onClick: (nextMove: Move<RetryData>, cardIdOfEffect) => {
      nextMove.effects.data[cardIdOfEffect] = { choice1: '', choice2: '' };
      nextMove.effects.queue.push([cardIdOfEffect, EFFECT]);
    },
    onQueue: (nextMove: Move<RetryData>, cardIdOfEffect) => {
      const retryCardIdsInQueue = nextMove.effects.queue
        .filter(([, effectId]) => effectId === EFFECT)
        .map(([cardId]) => cardId);

      const isFirstRetryInQueue = retryCardIdsInQueue[0] === cardIdOfEffect;
      if (!isFirstRetryInQueue) return;

      const beforeRetryMove = nextMove.effects.data[cardIdOfEffect].choice1 === '';
      if (beforeRetryMove) {
        const isMatch = nextMove.matched.has(nextMove.latestCard);
        if (!isMatch && twoChoices(nextMove)) {
          // C1 -> C2 (User has just chosen wrong 2nd card)
          nextMove.highlighted.add(nextMove.choice2);
          nextMove.highlighted.add(cardIdOfEffect);
          nextMove.effects.data[cardIdOfEffect].choice1 = nextMove.choice1;
          nextMove.effects.data[cardIdOfEffect].choice2 = nextMove.choice2;
          return;
        }
      } else {
        // C1 -> new C2 (User has just retried their 2nd card)
        const previousChoice1 = nextMove.effects.data[cardIdOfEffect].choice1;
        const previousChoice2 = nextMove.effects.data[cardIdOfEffect].choice2;

        // Treating retry as "Retry until choice2 is filled with a new matchable card".
        // Consistent with how other effects are treated as mini retry effects in the regular game:
        // Card1 -> Effect -> Card2 (Card1 does not un-flip, because Effect is not treated as a choice)
        const isEffectCard = nextMove.foundEffects.has(nextMove.latestCard);
        if (isEffectCard) {
          nextMove.choice2 = previousChoice2;
          nextMove.choice1 = previousChoice1;
          return;
        }

        nextMove.highlighted.delete(previousChoice2);
        nextMove.highlighted.delete(cardIdOfEffect);

        const isMatchableCard = nextMove.cards[nextMove.latestCard].type === 'matchable';
        if (isMatchableCard) {
          nextMove.choice2 = nextMove.choice1;
          nextMove.choice1 = previousChoice1;
          checkMatch(nextMove);

          const isMatch = nextMove.matched.has(nextMove.latestCard);
          const moreRetries = retryCardIdsInQueue.length > 1;
          if (!isMatch && moreRetries) {
            const nextRetryCardId = retryCardIdsInQueue[1];
            nextMove.highlighted.add(nextMove.choice2);
            nextMove.highlighted.add(nextRetryCardId);
            nextMove.effects.data[nextRetryCardId].choice1 = nextMove.choice1;
            nextMove.effects.data[nextRetryCardId].choice2 = nextMove.choice2;
          }
        }

        delete nextMove.effects.data[cardIdOfEffect];
      }
    },
  },
};
