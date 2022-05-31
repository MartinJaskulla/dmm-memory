import { shuffle } from '../utils/shuffle';
import { Snapshot } from '../features/useGame';
import { GETGoal } from './fetchGoal';
import { createId } from '../utils/createId';
import { Effect } from '../effects/effectMiddleware';

export function createGame(
  goalItems: GETGoal['goal_items'],
  effects: Effect[],
  nPairs: number,
  nEffects: number,
): Pick<Snapshot, 'cards' | 'cardIds'> {
  goalItems = structuredClone(goalItems);
  effects = JSON.parse(JSON.stringify(effects));

  const cards: Snapshot['cards'] = {};

  shuffle(effects);
  effects.slice(0, nEffects).forEach((effect) => {
    const id = createId();
    cards[id] = {
      type: 'effect',
      id,
      effect: effect.effect,
      text: effect.card.text,
    };
  });

  shuffle(goalItems);
  goalItems.slice(0, nPairs).forEach((goalItem) => {
    const id1 = createId();
    cards[id1] = {
      type: 'matchable',
      id: id1,
      matchId: goalItem.item.id,
      text: goalItem.item.cue.text,
      language: goalItem.item.cue.language,
    };

    const id2 = createId();
    cards[id2] = {
      type: 'matchable',
      id: id2,
      matchId: goalItem.item.id,
      text: goalItem.item.response.text,
      language: goalItem.item.response.language,
    };
  });

  const cardIds = Object.keys(cards);
  shuffle(cardIds);

  return { cards, cardIds };
}
