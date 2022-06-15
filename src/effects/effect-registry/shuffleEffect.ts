import { Effect } from '../effectMiddleware';
import { Move } from '../../features/useGame';
import { shuffle } from '../../utils/shuffle';

// Shuffle — Reshuffles all the cards on the board. Flipped pairs and effect cards should remain faceup, but move. The shuffle card itself should not change position.

const EFFECT = 'shuffle';

export const shuffleEffect: Effect = {
  effectId: EFFECT,
  card: {
    text: 'Shuffle',
  },
  middleware: {
    cardClick: (move: Move) => {
      const oldShuffleCardIndex = move.cardIds.findIndex((cardId) => cardId === move.latestCard);
      move.cardIds = shuffle(move.cardIds);
      const newShuffleCardIndex = move.cardIds.findIndex((cardId) => cardId === move.latestCard);
      // Swap shuffle card back to old index
      [move.cardIds[newShuffleCardIndex], move.cardIds[oldShuffleCardIndex]] = [
        move.cardIds[oldShuffleCardIndex],
        move.cardIds[newShuffleCardIndex],
      ];
      return move;
    },
  },
};
