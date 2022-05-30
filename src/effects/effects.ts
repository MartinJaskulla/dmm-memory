import { Snapshot } from '../features/useGame';
import { effectRegistry } from './effect-registry/effectRegistry';

type Middleware = (snapshot: Snapshot) => Snapshot;

export interface Effect {
  effect: string;
  card: {
    text: string;
  };
  middleware: {
    active?: Middleware;
    passive?: Middleware;
  };
}

interface Effects {
  effects: Effect[];
  middleware: Middleware;
}

export const effects: Effects = {
  effects: effectRegistry,
  middleware: (snapshot) => {
    return effectRegistry.reduce((finalSnapshot, effect): Snapshot => {
      if (snapshot.latestCard === null) return finalSnapshot;
      const revealedCard = finalSnapshot.cards[snapshot.latestCard];

      const active = revealedCard.type === 'effect' && revealedCard.effect === effect.effect;
      if (active) return effect.middleware.active?.(finalSnapshot) || finalSnapshot;

      const passive = effect.effect in snapshot.effects;
      if (passive) return effect.middleware.passive?.(finalSnapshot) || finalSnapshot;

      return finalSnapshot;
    }, snapshot);
  },
};
