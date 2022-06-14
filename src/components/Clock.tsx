import React, { useEffect, useState } from 'react';
import { useGame } from '../features/useGame';
import { formatMs } from '../utils/formatMs';

export function Clock() {
  const game = useGame();

  const [ms, setMs] = useState(0);

  useEffect(() => game.subscribeToClock((time) => setMs(time)), []);
  useEffect(() => setMs(game.move.totalMs), [game.move]);

  // gameOver check is needed when the countdown times out while the user has a different tab open
  return <span>⏱ {formatMs(game.move.gameOver ? game.move.totalMs : ms)}</span>;
}
