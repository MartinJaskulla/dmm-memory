import { Move } from '../hooks/useHistory/useHistoryValue';
import { effectLookup } from './effectRegistry';

const SEEN = 'seen';
export function explainEffect(nextMove: Move) {
  const card = nextMove.cards[nextMove.latestCard];
  if (card.type === 'effect') {
    const seen = localStorage.getItem(card.effectId) === SEEN;
    if (!seen) {
      const effect = effectLookup[card.effectId];
      setTimeout(() => alert(effect.description), 200);
      localStorage.setItem(card.effectId, SEEN);
    }
  }
}
