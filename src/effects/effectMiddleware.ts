import { Move } from '../features/useGame';
import { EffectData, effectList, effectRegistry } from './effect-registry/effectRegistry';

export type Middleware<T extends EffectData> = (move: Move<T>) => void;

export interface Effect<T extends EffectData = EffectData> {
  effectId: string;
  card: {
    text: string;
  };
  middleware: {
    cardClick?: Middleware<T>;
    data?: Middleware<T>;
  };
}
export function effectMiddleWare(move: Move) {
  const card = move.cards[move.latestCard];

  // Apply data effects before the click effect, because click effects add data for the next round
  move.effects.dataEffects.forEach((effectId) => effectRegistry[effectId].middleware.data?.(move));

  // Remove dataEffects which have no data
  move.effects.dataEffects = move.effects.dataEffects.filter((effectId) => effectId in move.effects.data);

  // Apply click effect
  effectList
    .find((effect) => card.type === 'effect' && card.effectId === effect.effectId)
    ?.middleware.cardClick?.(move);
}
