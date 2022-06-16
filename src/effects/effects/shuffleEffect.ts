import { Effect } from '../effectMiddleware';
import { Move } from '../../hooks/useHistory/useHistoryValue';
import { shuffle } from '../../utils/shuffle';

// Shuffle — Reshuffles all the cards on the board. Flipped pairs and effect cards should remain faceup, but move. The shuffle card itself should not change position.

const EFFECT = 'shuffle';

export const shuffleEffect: Effect = {
  effectId: EFFECT,
  card: {
    text: 'Shuffle',
  },
  middleware: {
    onClick: (nextMove: Move) => {
      const oldShuffleCardIndex = nextMove.cardIds.findIndex((cardId) => cardId === nextMove.latestCard);
      nextMove.cardIds = shuffle(nextMove.cardIds);
      const newShuffleCardIndex = nextMove.cardIds.findIndex((cardId) => cardId === nextMove.latestCard);
      // Swap shuffle card back to old index
      [nextMove.cardIds[newShuffleCardIndex], nextMove.cardIds[oldShuffleCardIndex]] = [
        nextMove.cardIds[oldShuffleCardIndex],
        nextMove.cardIds[newShuffleCardIndex],
      ];
      return nextMove;
    },
  },
};
