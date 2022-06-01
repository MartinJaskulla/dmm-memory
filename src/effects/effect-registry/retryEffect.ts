import { Effect } from '../effectMiddleware';
import { Move } from '../../features/useGame';

// TODO latestCard: Id | null; Can be used to visualize retry effect. Usually choice2 would be latest card (put outline around latest card). If you reetry, keep latestCard as firstCard, so it keeps the outline

// Retry — The next time you flip over a non-matching card, you get another chance (the first one stays flipped and the timer resets).

const EFFECT = 'retry';

export const retryEffect: Effect = {
  effect: EFFECT,
  card: {
    text: 'Retry',
  },
  middleware: {
    active: (move: Move) => {
      if (!move.latestCard) return move;

      // if (EFFECT in snapshot.effects && isRetry(snapshot.effects[EFFECT])) {
      //   if (snapshot.effects[EFFECT].savedChoice1 === null && oneChoice(snapshot)) {
      //     snapshot.effects[EFFECT].savedChoice1 = snapshot.choice1;
      //   } else {
      //     // Also check if it was a gamecard?
      //     const isMatch = snapshot.matched.has(snapshot.latestCard);
      //     if (!isMatch && twoChoices(snapshot)) {
      //       snapshot.choice1 = snapshot.effects[EFFECT].savedChoice1;
      //       delete snapshot.effects[EFFECT];
      //     }
      //   }
      // } else {
      //   // TODO Don't save when two cards are revealed
      //   const retry: Retry = { savedChoice1: snapshot.choice1 };
      //   snapshot.effects[EFFECT] = retry;
      // }

      return move;
    },
  },
};

// interface Retry {
//   savedChoice1: string | null;
// }
