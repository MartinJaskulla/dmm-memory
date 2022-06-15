import { CardId, EffectId, Move } from '../features/useGame';
import { EffectData, effectRegistry } from './effect-registry/effectRegistry';

export type Middleware<T extends EffectData> = (move: Move<T>, cardIdOfEffect: CardId) => void;

export interface Effect<T extends EffectData = EffectData> {
  effectId: EffectId;
  card: {
    text: string;
  };
  middleware: {
    cardClick?: Middleware<T>;
    nextClick?: Middleware<T>;
  };
}
export function effectMiddleWare(move: Move) {
  const card = move.cards[move.latestCard];

  // Apply nextClick effects before cardClick effects, because cardClick effects add nextClick effects for the *next* round
  move.effects.order.forEach(([cardId, effectId]) => effectRegistry[effectId].middleware.nextClick?.(move, cardId));

  // Remove nextClick effects which have no data
  move.effects.order = move.effects.order.filter(([cardId]) => cardId in move.effects.data);

  // Apply cardClick effect
  if (card.type === 'effect') {
    Object.values(effectRegistry)
      .find((effect) => card.effectId === effect.effectId)
      ?.middleware.cardClick?.(move, card.id);
  }
}
