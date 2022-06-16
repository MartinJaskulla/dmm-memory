export type GameOverId = 'FOUND_ALL_PAIRS' | 'TIME_PER_MOVE_RAN_OUT';
export const GAME_OVER: Record<GameOverId, { win: boolean; id: GameOverId }> = {
  FOUND_ALL_PAIRS: {
    win: true,
    id: 'FOUND_ALL_PAIRS',
  },
  TIME_PER_MOVE_RAN_OUT: {
    win: false,
    id: 'TIME_PER_MOVE_RAN_OUT',
  },
} as const;

export type GameOver = typeof GAME_OVER[keyof typeof GAME_OVER];
