import React from 'react';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { GameProvider } from './features/useGame';
import { effectRegistry } from './effects/effect-registry/effectRegistry';
import { Effect } from './effects/effectMiddleware';
import { TimeTravel } from './components/TimeTravel';

function App() {
  return (
    <GameProvider effects={effectRegistry as Effect[]}>
      <Header />
      <Board />
      <TimeTravel />
    </GameProvider>
  );
}

export default App;
