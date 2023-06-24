import { GameOverId } from 'src/config/gameOver';

// Don't store message in useHistory as gameOver.id, because messages might change
// and if a user loads a game from 3 years ago they get an old message. Also messages
// might not be unique.
export const MESSAGES: Record<GameOverId, string> = {
  FOUND_ALL_PAIRS: 'You found all pairs! 🎉',
  TIME_PER_MOVE_RAN_OUT: 'Time is up! 😭',
} as const;
