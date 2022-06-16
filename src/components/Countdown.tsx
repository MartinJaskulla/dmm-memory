import React, { useEffect, useState } from 'react';
import { formatMs } from '../utils/formatMs';
import { CONFIG } from '../config/config';
import { GAME_OVER } from '../config/gameOver';
import { NO_COUNTDOWN } from '../hooks/useHistory/useHistoryValue';
import { useHistory } from '../hooks/useHistory/useHistory';
import { useClock } from '../hooks/useClock/useClock';

export function Countdown() {
  const history = useHistory();
  const clock = useClock();

  const [remainingMs, setRemainingMs] = useState(history.move.msPerMove);

  useEffect(() => {
    setRemainingMs(history.move.msPerMove);
    if (history.move.msPerMove === NO_COUNTDOWN || history.move.gameOver) return;
    return clock.subscribe((msPlayed) => {
      const newRemaining = getRemainingMsForMove(msPlayed, history.move.msPlayed, history.move.msPerMove);
      // newRemaining can be less than 0 if the user switches to a different tab (requestAnimationFrame does not run) and returns after the countdown is over.
      setRemainingMs(newRemaining < 0 ? 0 : newRemaining);
    });
  }, [history.move]);

  useEffect(() => {
    if (remainingMs === 0)
      history.addMove({
        gameOver: GAME_OVER.TIME_PER_MOVE_RAN_OUT,
        msPlayed: history.move.msPlayed + history.move.msPerMove,
      });
  }, [remainingMs]);

  if (history.move.gameOver === GAME_OVER.TIME_PER_MOVE_RAN_OUT) {
    return <DisplayedCountdown ms={0} />;
  }

  if (history.move.gameOver) {
    return (
      // TODO HELPER FN
      <DisplayedCountdown
        ms={history.move.msPerMove - (history.move.msPlayed - history.moves[history.moves.length - 2].msPlayed)}
      />
    );
  }
  if (remainingMs === NO_COUNTDOWN) {
    return <DisplayedCountdown ms={CONFIG.TIME_PER_MOVE} />;
  }
  return <DisplayedCountdown ms={remainingMs} />;
}

function DisplayedCountdown({ ms }: { ms: number }) {
  return <div>⏳ {formatMs(ms)}</div>;
}

export function getRemainingMsForMove(clockMs: number, moveMs: number, moveTimeLimit: number) {
  const msSinceStart = clockMs - moveMs;
  return moveTimeLimit - msSinceStart;
}
