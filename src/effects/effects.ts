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
    history?: HistoryMiddleware;
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
      return effectRegistry.reduce((finalSnapshot, effect) => {
        if (snapshot.latestCard === null) return finalSnapshot;
        const revealedCard = finalSnapshot.cards[snapshot.latestCard];

        const sameEffect = revealedCard.type === 'effect' && revealedCard.effect === effect.effect;
        const hasPastEffect = effect.effect in snapshot.effects;
        if (!sameEffect && !hasPastEffect) return finalSnapshot;

        const middleware = effect.middleware.history;
        if (!middleware) return finalSnapshot;

        return middleware(finalSnapshot);
      }, snapshot);
    },
    game: (game) =>
      effectRegistry.reduce((finalGame, effect) => {
        return effect.middleware.game?.(finalGame) || finalGame;
      }, game),
  },
};
