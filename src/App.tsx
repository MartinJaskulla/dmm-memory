import React from 'react';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { GameProvider } from './hooks/useGame/useGame';
import { ClockProvider } from './hooks/useClock/useClock';
import { HistoryProvider } from './hooks/useHistory/useHistory';

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
