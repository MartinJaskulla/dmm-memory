import { GameCardEffect, GameContextValue, Snapshot } from '../features/useGame';
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

const cards: GameCardEffect[] = [];
const historyMiddlewares: HistoryMiddleware[] = [];
const gameMiddlewares: GameMiddleware[] = [];

effectRegistry.forEach((effect) => {
  cards.push({ type: 'effect', effect: effect.effect, text: effect.card.text });
  if (effect.middleware.history) historyMiddlewares.push(effect.middleware.history);
  if (effect.middleware.game) gameMiddlewares.push(effect.middleware.game);
});

export const effects = {
  middleware: {
    history: (snapshot: Snapshot): Snapshot =>
      historyMiddlewares.reduce((finalSnapshot, middleware) => middleware(finalSnapshot), snapshot),
    game: (game: GameContextValue): GameContextValue =>
      gameMiddlewares.reduce((finalGame, middleware) => middleware(finalGame), game),
  },
  cards,
};
