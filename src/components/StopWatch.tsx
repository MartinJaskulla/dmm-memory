import React, { useEffect, useState } from 'react';
import { formatMs } from '../utils/formatMs';
import { useClock } from '../hooks/useClock/useClock';
import { useHistory } from '../hooks/useHistory/useHistory';

export function StopWatch() {
  const history = useHistory();
  const clock = useClock();

  const [msPlayed, setMsPlayed] = useState(0);

  useEffect(() => clock.subscribe((msPlayed) => setMsPlayed(msPlayed)), []);
  useEffect(() => setMsPlayed(history.move.msPlayed), [history.move]);

  // gameOver check is needed when the countdown times out while the user has a different tab open
  return <span>⏱️ {formatMs(history.move.gameOver ? history.move.msPlayed : msPlayed)}</span>;
}
