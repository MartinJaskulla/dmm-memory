import { Effect } from '../effects';
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
    history: (snapshot: Snapshot) => {
      const shuffleCardIndexOld = snapshot.cards.findIndex((card) => card.id === snapshot.latestCard);
      snapshot.cards = shuffle(snapshot.cards);
      const shuffleCardIndexNew = snapshot.cards.findIndex((card) => card.id === snapshot.latestCard);
      // Swap back to old index
      [snapshot.cards[shuffleCardIndexNew], snapshot.cards[shuffleCardIndexOld]] = [
        snapshot.cards[shuffleCardIndexOld],
        snapshot.cards[shuffleCardIndexNew],
      ];

      return snapshot;
    },
  },
};
