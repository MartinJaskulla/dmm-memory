import React from 'react';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { GameProvider } from './features/useGame';
import { useClock } from './features/useClock';

function App() {
  return (
    <GameProvider clock={useClock()}>
      <Header></Header>
      <Board></Board>
    </GameProvider>
  );
}

export default App;
