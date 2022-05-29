import { GameContextValue, Snapshot } from '../features/useGame';
import { effectRegistry } from './effect-registry/effectRegistry';

type HistoryMiddleware = (snapshot: Snapshot) => Snapshot;
type GameMiddleware = (game: GameContextValue) => GameContextValue;

export interface Effect {
  effect: string;
  card: {
    text: string;
  };
  middleware: {
    history?: {
      active?: HistoryMiddleware;
      passive?: HistoryMiddleware;
    };
    game?: GameMiddleware;
  };
}

interface Effects {
  effects: Effect[];
  middleware: {
    history: HistoryMiddleware;
    game: GameMiddleware;
  };
}

export const effects: Effects = {
  effects: effectRegistry,
  middleware: {
    history: (snapshot) => {
      return effectRegistry.reduce((finalSnapshot, effect): Snapshot => {
        if (snapshot.latestCard === null) return finalSnapshot;
        const revealedCard = finalSnapshot.cards[snapshot.latestCard];

        const active = revealedCard.type === 'effect' && revealedCard.effect === effect.effect;
        if (active) return effect.middleware.history?.active?.(finalSnapshot) || finalSnapshot;

        const passive = effect.effect in snapshot.effects;
        if (passive) return effect.middleware.history?.passive?.(finalSnapshot) || finalSnapshot;

        return finalSnapshot;
      }, snapshot);
    },
    game: (game) =>
      effectRegistry.reduce((finalGame, effect) => {
        return effect.middleware.game?.(finalGame) || finalGame;
      }, game),
  },
};
