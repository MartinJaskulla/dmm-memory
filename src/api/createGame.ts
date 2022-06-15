import { shuffle } from '../utils/shuffle';
import { CardId, Move } from '../features/useGame';
import { GETGoal } from './fetchGoal';
import { createId } from '../utils/createId';
import { effectRegistry } from '../effects/effect-registry/effectRegistry';
import { pickRandom } from '../utils/pickRandom';

export function createGame(
  goalItems: GETGoal['goal_items'],
  nPairs: number,
  nEffects: number,
  nHints: number,
): Pick<Move, 'cards' | 'cardIds' | 'hints'> {
  const cards: Move['cards'] = {};
  const hints = new Set<CardId>();

  // Allow duplicate effects
  for (let i = 0; i < nEffects; i++) {
    const effect = pickRandom(effectRegistry);
    const id = createId();
    cards[id] = {
      type: 'effect',
      id,
      effectId: effect.effectId,
      text: effect.card.text,
    };
  }

  goalItems = structuredClone(goalItems);
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

  const cardIds: CardId[] = Object.keys(cards);
  shuffle(cardIds);

  return { cards, cardIds, hints };
}
