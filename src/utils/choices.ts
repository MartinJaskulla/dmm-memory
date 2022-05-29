import { GameContextValue, Snapshot } from '../features/useGame';

export function zeroChoices(snapshotOrGame: Snapshot | GameContextValue): boolean {
  return Boolean(!snapshotOrGame.choice1 && !snapshotOrGame.choice2);
}

export function oneChoice(snapshotOrGame: Snapshot | GameContextValue): boolean {
  return Boolean(snapshotOrGame.choice1 && !snapshotOrGame.choice2);
}

export function twoChoices(snapshotOrGame: Snapshot | GameContextValue): boolean {
  return Boolean(snapshotOrGame.choice1 && snapshotOrGame.choice2);
}
