import { Move } from 'src/hooks/useHistory/useHistoryValue';

export function hasNoCardSelected(choices: Pick<Move, 'choice1' | 'choice2'>): boolean {
  return Boolean(!choices.choice1 && !choices.choice2);
}

export function hasOneCardSelected(choices: Pick<Move, 'choice1' | 'choice2'>): boolean {
  return Boolean(choices.choice1 && !choices.choice2);
}

export function hasTwoCardsSelected(choices: Pick<Move, 'choice1' | 'choice2'>): boolean {
  return Boolean(choices.choice1 && choices.choice2);
}
