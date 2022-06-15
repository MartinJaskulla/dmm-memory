import { Move } from '../hooks/useGame';

export function zeroChoices(choices: Pick<Move, 'choice1' | 'choice2'>): boolean {
  return Boolean(!choices.choice1 && !choices.choice2);
}

export function oneChoice(choices: Pick<Move, 'choice1' | 'choice2'>): boolean {
  return Boolean(choices.choice1 && !choices.choice2);
}

export function twoChoices(choices: Pick<Move, 'choice1' | 'choice2'>): boolean {
  return Boolean(choices.choice1 && choices.choice2);
}
