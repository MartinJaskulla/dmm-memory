import React from 'react';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { GameProvider } from './features/useGame';
import { TimeTravel } from './components/TimeTravel';

function App() {
  return (
    <GameProvider>
      <Header />
      <TimeTravel />
      <Board />
    </GameProvider>
  );
}

export default App;
