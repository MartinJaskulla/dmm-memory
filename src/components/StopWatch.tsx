import React, { useEffect, useState } from 'react';
import { useGame } from '../hooks/useGame';
import { formatMs } from '../utils/formatMs';

export function StopWatch() {
  const game = useGame();

  const [msPlayed, setMsPlayed] = useState(0);

  useEffect(() => game.subscribeToClock((msPlayed) => setMsPlayed(msPlayed)), []);
  useEffect(() => setMsPlayed(game.move.msPlayed), [game.move]);

  // gameOver check is needed when the countdown times out while the user has a different tab open
  return <span>⏱ {formatMs(game.move.gameOver ? game.move.msPlayed : msPlayed)}</span>;
}
