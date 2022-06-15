import React from 'react';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { GameProvider } from './hooks/useGame';

function App() {
  return (
    <GameProvider>
      <Header />
      <Board />
    </GameProvider>
  );
}

export default App;
