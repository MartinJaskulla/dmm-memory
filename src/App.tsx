import React from 'react';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { GameProvider } from './features/useGame';
import { useClock } from './features/useClock';
import { useCountdown } from './features/useCountdown';
import { effectRegistry } from './effects/effect-registry/effectRegistry';
import { Effect } from './effects/effectMiddleware';

function App() {
  return (
    <GameProvider clock={useClock()} countdown={useCountdown()} effects={effectRegistry as Effect[]}>
      <Header />
      <Board />
    </GameProvider>
  );
}

export default App;
