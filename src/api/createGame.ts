import { shuffle } from '../utils/shuffle';
import { Id, Move } from '../features/useGame';
import { GETGoal } from './fetchGoal';
import { createId } from '../utils/createId';
import { EffectList, effectList } from '../effects/effect-registry/effectRegistry';

export function createGame(
  goalItems: GETGoal['goal_items'],
  nPairs: number,
  nEffects: number,
  nHints: number,
): Pick<Move, 'cards' | 'cardIds' | 'hints'> {
  goalItems = structuredClone(goalItems);
  const effects: EffectList = JSON.parse(JSON.stringify(effectList));

  const cards: Move['cards'] = {};
  const hints = new Set<Id>();

  shuffle(effects);
  effects.slice(0, nEffects).forEach((effect) => {
    const id = createId();
    cards[id] = {
      type: 'effect',
      id,
      effectId: effect.effectId,
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

    if (nHints > 0) {
      const hintId = Math.random() < 0.5 ? id1 : id2;
      hints.add(hintId);
      nHints--;
    }
  });

  const cardIds: Id[] = Object.keys(cards);
  shuffle(cardIds);

  return { cards, cardIds, hints };
}
