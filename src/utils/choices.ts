import { Snapshot } from '../features/useGame';

export function zeroChoices(snapshotLike: Pick<Snapshot, 'choice1' | 'choice2'>): boolean {
  return Boolean(!snapshotLike.choice1 && !snapshotLike.choice2);
}

export function oneChoice(snaphotLike: Pick<Snapshot, 'choice1' | 'choice2'>): boolean {
  return Boolean(snaphotLike.choice1 && !snaphotLike.choice2);
}

export function twoChoices(snaphotLike: Pick<Snapshot, 'choice1' | 'choice2'>): boolean {
  return Boolean(snaphotLike.choice1 && snaphotLike.choice2);
}
