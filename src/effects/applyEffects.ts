import { CardId, EffectId, Move } from 'src/hooks/useHistory/useHistoryValue';
import { effectLookup } from 'src/effects/effectRegistry';

export type Middleware = (nextMove: Move, cardIdOfEffect: CardId) => void;

export interface Effect {
  effectId: EffectId;
  card: {
    text: string;
  };
  middleware: {
    onClick: Middleware;
    onQueue?: Middleware;
  };
  description: string;
}
export function applyEffects(nextMove: Move) {
  const card = nextMove.cards[nextMove.latestCard];

  // Call onQueue before onClick, because onClicks queue onQueues for the *next* move
  nextMove.effects.queue.forEach(([cardIdOfEffect, effectId]) =>
    effectLookup[effectId].middleware.onQueue?.(nextMove, cardIdOfEffect),
  );

  // Remove onQueues which have no data.
  nextMove.effects.queue = nextMove.effects.queue.filter(([cardId]) => cardId in nextMove.effects.data);

  // Call onClick when effect card was clicked
  if (card.type === 'effect') {
    effectLookup[card.effectId]?.middleware.onClick?.(nextMove, card.cardId);
  }
}
