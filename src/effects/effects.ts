import { GameContextValue, Snapshot } from '../features/useGame';
import { effectRegistry } from './effect-registry/effectRegistry';

type HistoryMiddleware = (snapshot: Snapshot, revealedCardIndex: number) => Snapshot;
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
    history: (snapshot, revealedCardIndex) =>
      effectRegistry.reduce(
        (finalSnapshot, effect) => effect.middleware.history?.(finalSnapshot, revealedCardIndex) || finalSnapshot,
        snapshot,
      ),
    game: (game) =>
      effectRegistry.reduce((finalGame, effect) => effect.middleware.game?.(finalGame) || finalGame, game),
  },
};
