import React from 'react';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { GameProvider } from './features/useGame';
import { TimeTravel } from './components/TimeTravel';

function App() {
  return (
    <GameProvider>
      <Header />
      <Board />
      <TimeTravel />
    </GameProvider>
  );
}

export default App;
