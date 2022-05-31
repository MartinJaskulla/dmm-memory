import { Snapshot } from '../features/useGame';

export type Middleware<T extends Snapshot['effects']> = (snapshot: Snapshot<T>) => void;

export interface Effect<T extends Snapshot['effects'] = Snapshot['effects']> {
  effect: string;
  card: {
    text: string;
  };
  middleware: {
    active?: Middleware<T>;
    passive?: Middleware<T>;
  };
}
export function effectMiddleWare(effects: Effect[], snapshot: Snapshot) {
  effects.forEach((effect) => {
    const card = snapshot.cards[snapshot.latestCard];

    const active = card.type === 'effect' && card.effect === effect.effect;
    const passive = effect.effect in snapshot.effects;
    if (active) {
      effect.middleware.active?.(snapshot);
    } else if (passive) {
      effect.middleware.passive?.(snapshot);
    }
  });
}
