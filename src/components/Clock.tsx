import React, { useEffect, useState } from 'react';
import { useGame } from '../features/useGame';

export function Clock() {
  const game = useGame();

  const [ms, setMs] = useState(0);

  useEffect(() => game.subscribeToClock((time) => setMs(time)), []);
  useEffect(() => setMs(game.move.totalMs), [game.move]);

  const formattedMs = new Date(ms).toISOString().slice(14, 23);

  return <span>⏱ {formattedMs}</span>;
}
