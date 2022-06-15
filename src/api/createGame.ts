import { shuffle } from '../utils/shuffle';
import { CardId, Move } from '../hooks/useGame';
import { GETGoal } from './fetchGoal';
import { createId } from '../utils/createId';
import { effectRegistry } from '../effects/effectRegistry';
import { pickRandom } from '../utils/pickRandom';

export function createGame(
  goalItems: GETGoal['goal_items'],
  nPairs: number,
  nEffects: number,
  nHints: number,
): Pick<Move, 'cards' | 'cardIds' | 'hinted'> {
  const cards: Move['cards'] = {};
  const hinted = new Set<CardId>();

  // Allow duplicate effects
  for (let i = 0; i < nEffects; i++) {
    const effect = pickRandom(effectRegistry);
    const cardId = createId();
    cards[cardId] = {
      type: 'effect',
      cardId,
      effectId: effect.effectId,
      text: effect.card.text,
    };
  }

  goalItems = structuredClone(goalItems);
  shuffle(goalItems);
  goalItems.slice(0, nPairs).forEach((goalItem) => {
    const cardId1 = createId();
    cards[cardId1] = {
      type: 'matchable',
      cardId: cardId1,
      matchId: goalItem.item.id,
      text: goalItem.item.cue.text,
      language: goalItem.item.cue.language,
    };

    const cardId2 = createId();
    cards[cardId2] = {
      type: 'matchable',
      cardId: cardId2,
      matchId: goalItem.item.id,
      text: goalItem.item.response.text,
      language: goalItem.item.response.language,
    };

    if (nHints > 0) {
      const hintId = Math.random() < 0.5 ? cardId1 : cardId2;
      hinted.add(hintId);
      nHints--;
    }
  });

  const cardIds: CardId[] = Object.keys(cards);
  shuffle(cardIds);

  return { cards, cardIds, hinted };
}
