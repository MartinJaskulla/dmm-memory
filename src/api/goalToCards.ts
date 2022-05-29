import { shuffle } from '../utils/shuffle';
import { GameCard } from '../features/useGame';
import { GETGoal } from './fetchGoal';
import { createId } from '../utils/createId';
import { Effect } from '../effects/effects';

export function goalToCards(goal: GETGoal, effects: Effect[]): GameCard[] {
  const cards: GameCard[] = effects.map(
    (effect): GameCard => ({
      type: 'effect',
      id: createId(),
      effect: effect.effect,
      text: effect.card.text,
    }),
  );

  const goalItems: GETGoal['goal_items'] = structuredClone(goal.goal_items);
  shuffle(goalItems);
  const randomGoalItems = goalItems.slice(0, 6);
  randomGoalItems.forEach((item) => {
    cards.push({
      type: 'matchable',
      id: createId(),
      matchId: item.item.id,
      text: item.item.cue.text,
      language: item.item.cue.language,
    });
    cards.push({
      type: 'matchable',
      id: createId(),
      matchId: item.item.id,
      text: item.item.response.text,
      language: item.item.response.language,
    });
  });
  shuffle(cards);
  return cards;
}
