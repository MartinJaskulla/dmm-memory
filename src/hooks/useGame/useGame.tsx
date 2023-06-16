import React, { useEffect } from 'react';
import { fetchGoal } from '../../api/fetchGoal';
import { createGame } from './createGame';
import { useClock } from '../useClock/useClock';
import { MESSAGES } from '../../config/messages';
import { useHistory } from '../useHistory/useHistory';
import { Game } from './game';

export interface GameValue {
  revealCard: (index: number) => void;
}

const GameContext = React.createContext<GameValue>({} as GameValue);

interface GameProps {
  children: React.ReactNode;
}

const GameProvider = ({ children }: GameProps) => {
  const history = useHistory();
  const clock = useClock();

  // React 18 calls useEffect twice in StrictMode, which means we call newGame() twice on mount. Some solutions to prevent making two api calls:
  // Jack Herrington: https://jherr2020.medium.com/react-18-useeffect-double-call-for-apis-emergency-fix-724b7ee6a646
  // Dan Abramov: https://github.com/facebook/react/issues/24502#issuecomment-1118867879
  useEffect(() => {
    newGame();
  }, []);

  async function newGame() {
    const { goal_items } = await fetchGoal();
    const game = createGame(goal_items);
    history.resetMoves(game);
  }

  useEffect(() => {
    if (history.move.gameOver) {
      const message = MESSAGES[history.move.gameOver.id];
      setTimeout(() => alert(message), 100);
    }
  }, [history.move.gameOver]);

  useEffect(() => {
    clock.stop();
    if (!history.move.gameOver) clock.start(history.move.msPlayed);
    // Restart clock when time traveling
  }, [history.move]);

  function revealCard(cardIndex: number) {
    history.addMove(Game.revealCard(cardIndex, history.move, clock.getMs()));
  }

  return (
    <GameContext.Provider
      value={{
        revealCard,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

function useGame(): GameValue {
  return React.useContext(GameContext);
}

export { GameProvider, useGame };
