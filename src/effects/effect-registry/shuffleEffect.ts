import { Effect } from '../effectMiddleware';
import { Snapshot } from '../../features/useGame';
import { shuffle } from '../../utils/shuffle';

// Reshuffles all the cards on the board. Flipped pairs and effect cards should remain face-up, but move. The shuffle card itself should not change position.

const EFFECT = 'shuffle';

export const shuffleEffect: Effect = {
  effect: EFFECT,
  card: {
    text: 'Shuffle',
  },
  middleware: {
    active: (snapshot: Snapshot) => {
      const shuffleCardIndexOld = snapshot.cardIds.findIndex((cardId) => cardId === snapshot.latestCard);
      snapshot.cardIds = shuffle(snapshot.cardIds);
      const shuffleCardIndexNew = snapshot.cardIds.findIndex((cardId) => cardId === snapshot.latestCard);
      // Swap back to old index
      [snapshot.cardIds[shuffleCardIndexNew], snapshot.cardIds[shuffleCardIndexOld]] = [
        snapshot.cardIds[shuffleCardIndexOld],
        snapshot.cardIds[shuffleCardIndexNew],
      ];
      return snapshot;
    },
  },
};
