import { CardId, EffectId, Move } from '../features/useGame';
import { effectLookup } from './effect-registry/effectRegistry';

export type Middleware = (move: Move, cardIdOfEffect: CardId) => void;

export interface Effect {
  effectId: EffectId;
  card: {
    text: string;
  };
  middleware: {
    onClick: Middleware;
    onQueue?: Middleware;
  };
}
export function effectMiddleWare(move: Move) {
  const card = move.cards[move.latestCard];

  // Call onQueue before onClick, because onClicks queue onQueues for the *next* move
  move.effects.queue.forEach(([cardId, effectId]) => effectLookup[effectId].middleware.onQueue?.(move, cardId));

  // Remove onQueues which have no data
  move.effects.queue = move.effects.queue.filter(([cardId]) => cardId in move.effects.data);

  // Call onClick when effect card was clicked
  if (card.type === 'effect') {
    effectLookup[card.effectId]?.middleware.onClick?.(move, card.id);
  }
}
