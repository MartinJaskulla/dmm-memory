import { shuffle } from '../utils/shuffle';
import { Snapshot } from '../features/useGame';
import { GETGoal } from './fetchGoal';
import { createId } from '../utils/createId';
import { Effect } from '../effects/effects';

export function goalToCards(goal: GETGoal, effects: Effect[]): Pick<Snapshot, 'cards' | 'cardIds'> {
  const cards: Snapshot['cards'] = {};

  effects.forEach((effect) => {
    const id = createId();
    cards[id] = {
      type: 'effect',
      id,
      effect: effect.effect,
      text: effect.card.text,
    };
  });

  const goalItems: GETGoal['goal_items'] = structuredClone(goal.goal_items);
  shuffle(goalItems);
  const randomGoalItems = goalItems.slice(0, 6);
  randomGoalItems.forEach((item) => {
    const id1 = createId();
    cards[id1] = {
      type: 'matchable',
      id: id1,
      matchId: item.item.id,
      text: item.item.cue.text,
      language: item.item.cue.language,
    };

    const id2 = createId();
    cards[id2] = {
      type: 'matchable',
      id: id2,
      matchId: item.item.id,
      text: item.item.response.text,
      language: item.item.response.language,
    };
  });

  const cardIds = Object.keys(cards);

  shuffle(cardIds);

  return { cards, cardIds };
}
