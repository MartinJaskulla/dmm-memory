import { Move } from '../features/useGame';

export type Middleware<T extends Move['effects']> = (move: Move<T>) => void;

export interface Effect<T extends Move['effects'] = Move['effects']> {
  effect: string;
  card: {
    text: string;
  };
  middleware: {
    active?: Middleware<T>;
    passive?: Middleware<T>;
  };
}
export function effectMiddleWare(effects: Effect[], move: Move) {
  effects.forEach((effect) => {
    const card = move.cards[move.latestCard];

    const active = card.type === 'effect' && card.effect === effect.effect;
    const passive = effect.effect in move.effects;
    if (active) {
      effect.middleware.active?.(move);
    } else if (passive) {
      effect.middleware.passive?.(move);
    }
  });
}
