import { Snapshot } from './gameContext';
import { useCountdown } from '../utils/useCountdown';

export function setCountdown(snapshot: Snapshot, countdown: ReturnType<typeof useCountdown>): void {
  countdown.stop();
  if (typeof snapshot.choice1 === 'number' && typeof snapshot.choice2 !== 'number') {
    if (snapshot.countdown) countdown.start(snapshot.countdown);
  }
}
