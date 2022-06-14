import { Move } from '../features/useGame';

// TODO Delete this file or make ts understand choice1 & 2 are truthy now or use "" instead of null for choice1&2

export function zeroChoices(choices: Pick<Move, 'choice1' | 'choice2'>): boolean {
  return Boolean(!choices.choice1 && !choices.choice2);
}

export function oneChoice(choices: Pick<Move, 'choice1' | 'choice2'>): boolean {
  return Boolean(choices.choice1 && !choices.choice2);
}

export function twoChoices(choices: Pick<Move, 'choice1' | 'choice2'>): boolean {
  return Boolean(choices.choice1 && choices.choice2);
}
