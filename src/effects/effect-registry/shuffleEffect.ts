import { Effect } from '../effectMiddleware';
import { Move } from '../../features/useGame';
import { shuffle } from '../../utils/shuffle';

// Reshuffles all the cards on the board. Flipped pairs and effect cards should remain face-up, but move. The shuffle card itself should not change position.

const EFFECT = 'shuffle';

export const shuffleEffect: Effect = {
  effectId: EFFECT,
  card: {
    text: 'Shuffle',
  },
  middleware: {
    cardClick: (move: Move) => {
      const shuffleCardIndexOld = move.cardIds.findIndex((cardId) => cardId === move.latestCard);
      move.cardIds = shuffle(move.cardIds);
      const shuffleCardIndexNew = move.cardIds.findIndex((cardId) => cardId === move.latestCard);
      // Swap back to old index
      [move.cardIds[shuffleCardIndexNew], move.cardIds[shuffleCardIndexOld]] = [
        move.cardIds[shuffleCardIndexOld],
        move.cardIds[shuffleCardIndexNew],
      ];
      return move;
    },
  },
};
