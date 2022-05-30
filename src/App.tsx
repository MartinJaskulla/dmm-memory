import React from 'react';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { GameProvider } from './features/useGame';
import { useClock } from './features/useClock';
import { useCountdown } from './features/useCountdown';

function App() {
  return (
    <GameProvider clock={useClock()} countdown={useCountdown()}>
      <Header />
      <Board />
    </GameProvider>
  );
}

export default App;
