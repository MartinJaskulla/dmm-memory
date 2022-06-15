import { CardId, EffectId, Move } from '../features/useGame';
import { effectLookup } from './effect-registry/effectRegistry';

export type Middleware = (move: Move, cardIdOfEffect: CardId) => void;

export interface Effect {
  effectId: EffectId;
  card: {
    text: string;
  };
  middleware: {
    cardClick: Middleware;
    nextClick?: Middleware;
  };
}
export function effectMiddleWare(move: Move) {
  const card = move.cards[move.latestCard];

  // Apply nextClick effects before cardClick effects, because cardClick effects add nextClick effects for the *next* round
  move.effects.order.forEach(([cardId, effectId]) => effectLookup[effectId].middleware.nextClick?.(move, cardId));

  // Remove nextClick effects which have no data
  move.effects.order = move.effects.order.filter(([cardId]) => cardId in move.effects.data);

  // Apply cardClick effect
  if (card.type === 'effect') {
    effectLookup[card.effectId]?.middleware.cardClick?.(move, card.id);
  }
}
