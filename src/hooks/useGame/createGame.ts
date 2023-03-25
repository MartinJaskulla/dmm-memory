import { shuffle } from '../../utils/shuffle';
import { CardId, Move } from '../useHistory/useHistoryValue';
import { GETGoal } from '../../api/fetchGoal';
import { v4 } from 'uuid';
import { effectRegistry } from '../../effects/effectRegistry';
import { pickRandom } from '../../utils/pickRandom';
import { CONFIG } from '../../config/config';

export function createGame(goalItems: GETGoal['goal_items']): Pick<Move, 'cards' | 'cardIds' | 'hinted'> {
  const cards: Move['cards'] = {};
  const hinted = new Set<CardId>();

  // Allow duplicate effects
  for (let i = 0; i < CONFIG.EFFECTS; i++) {
    const effect = pickRandom(effectRegistry);
    const cardId = v4();
    cards[cardId] = {
      type: 'effect',
      cardId,
      effectId: effect.effectId,
      text: effect.card.text,
    };
  }

  let remainingHints = CONFIG.HINTS;
  goalItems = structuredClone(goalItems);
  shuffle(goalItems);
  goalItems.slice(0, CONFIG.PAIRS).forEach((goalItem) => {
    const cardId1 = v4();
    cards[cardId1] = {
      type: 'matchable',
      cardId: cardId1,
      matchId: goalItem.item.id,
      text: goalItem.item.cue.text,
      language: goalItem.item.cue.language,
    };

    const cardId2 = v4();
    cards[cardId2] = {
      type: 'matchable',
      cardId: cardId2,
      matchId: goalItem.item.id,
      text: goalItem.item.response.text,
      language: goalItem.item.response.language,
    };

    if (remainingHints > 0) {
      const hintId = Math.random() < 0.5 ? cardId1 : cardId2;
      hinted.add(hintId);
      remainingHints--;
    }
  });

  const cardIds: CardId[] = Object.keys(cards);
  shuffle(cardIds);

  return { cards, cardIds, hinted };
}
