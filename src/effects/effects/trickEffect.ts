import { Effect } from 'src/effects/applyEffects';
import { pickRandom } from 'src/utils/pickRandom';
import { GameCardMatchable, Move } from 'src/hooks/useHistory/useHistoryValue';

const EFFECT = 'trick';

export const trickEffect: Effect = {
  effectId: EFFECT,
  description: 'Trick — Unflips one pair of matched word cards but flips over another pair of words.',
  card: {
    text: 'Trick',
  },
  middleware: {
    onClick: (nextMove: Move) => {
      const atLeastOneMatch = nextMove.matched.size >= 2;
      if (!atLeastOneMatch) return;

      const nonMatchedCards: GameCardMatchable[] = [];
      const matchedCards: GameCardMatchable[] = [];
      Object.values(nextMove.cards)
        .filter((card): card is GameCardMatchable => card.type === 'matchable')
        .forEach((card) => (nextMove.matched.has(card.cardId) ? matchedCards.push(card) : nonMatchedCards.push(card)));

      const newMatchId = pickRandom(nonMatchedCards).matchId;
      const newMatchCardIds = nonMatchedCards.filter((card) => card.matchId === newMatchId).map((card) => card.cardId);

      const oldMatchId = pickRandom(matchedCards).matchId;
      const oldMatchCardIds = matchedCards.filter((card) => card.matchId === oldMatchId).map((card) => card.cardId);

      oldMatchCardIds.forEach((cardId) => nextMove.matched.delete(cardId));
      newMatchCardIds.forEach((cardId) => nextMove.matched.add(cardId));

      // choice1 or choice2 could be part of the new match and need to be cleared
      if (nextMove.matched.has(nextMove.choice1)) nextMove.choice1 = '';
      if (nextMove.matched.has(nextMove.choice2)) nextMove.choice2 = '';
    },
  },
};
