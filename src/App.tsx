import React from 'react';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { GameProvider } from './contexts/gameContext';

function App() {
  return (
    <GameProvider>
      <Header></Header>
      <Board></Board>
    </GameProvider>
  );
}

export default App;
