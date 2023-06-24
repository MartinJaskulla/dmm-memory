import React, { useEffect } from 'react';
import { fetchGoal } from 'src/api/fetchGoal';
import { createGame } from 'src/hooks/useGame/createGame';
import { useClock } from 'src/hooks/useClock/useClock';
import { MESSAGES } from 'src/config/messages';
import { useHistory } from 'src/hooks/useHistory/useHistory';
import { Game } from 'src/hooks/useGame/game';

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
  // Best option would be to not use useEffect for data fetching, but to bind this to an event handler:
  //  David Khourshid: https://www.youtube.com/watch?v=HPoC-k7Rxwo
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
    history.addMove(Game.nextMove({ cardIndex, currentMove: history.move, msPlayed: clock.getMs() }));
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
