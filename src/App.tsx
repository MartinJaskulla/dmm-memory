import React from 'react';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { GameProvider } from './features/useGame';
import { useClock } from './features/useClock';
import { CountdownProvider } from './features/useCountdown';

function App() {
  return (
    <GameProvider
      clock={useClock()}
      onWin={(gameValue) => alert(`You have won in ${gameValue.moves} moves!`)}
      onLoose={() => alert('Time is up!')}
    >
      <CountdownProvider>
        <Header />
      </CountdownProvider>
      <Board />
    </GameProvider>
  );
}

export default App;
