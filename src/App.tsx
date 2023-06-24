import React from 'react';
import { Header } from 'src/components/Header';
import { Board } from 'src/components/Board';
import { GameProvider } from 'src/hooks/useGame/useGame';
import { ClockProvider } from 'src/hooks/useClock/useClock';
import { HistoryProvider } from 'src/hooks/useHistory/useHistory';

function App() {
  return (
    <HistoryProvider>
      <ClockProvider>
        <GameProvider>
          <Header />
          <Board />
        </GameProvider>
      </ClockProvider>
    </HistoryProvider>
  );
}

export default App;
