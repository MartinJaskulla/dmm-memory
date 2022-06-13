import React, { useEffect, useState } from 'react';
import { useGame } from '../features/useGame';

export function Clock() {
  const game = useGame();

  const [ms, setMs] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => game.subscribeToClock((time) => setMs(time)), []);

  // TODO Maybe not needed to check gameOver
  const formattedMs = new Date(game.move.gameOver ? game.move.totalMs : ms).toISOString().slice(14, 23);

  return <span>⏱ {formattedMs}</span>;
}
