import { shuffle } from '../utils/shuffle';
import { GameCard, GameCardEffect } from '../features/useGame';
import { GETGoal } from './fetchGoal';

export function goalToCards(goal: GETGoal, effects: GameCardEffect[]): GameCard[] {
  const cards: GameCard[] = structuredClone(effects);

  const goalItems: GETGoal['goal_items'] = structuredClone(goal.goal_items);
  shuffle(goalItems);
  const randomGoalItems = goalItems.slice(0, 6);
  randomGoalItems.forEach((item) => {
    cards.push({
      type: 'matchable',
      id: item.item.id,
      text: item.item.cue.text,
      language: item.item.cue.language,
    });
    cards.push({
      type: 'matchable',
      id: item.item.id,
      text: item.item.response.text,
      language: item.item.response.language,
    });
  });
  shuffle(cards);
  return cards;
}
