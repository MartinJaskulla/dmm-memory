import React from 'react';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { GameProvider } from './features/useGame';

function App() {
  return (
    <GameProvider>
      <Header></Header>
      <Board></Board>
    </GameProvider>
  );
}

export default App;
