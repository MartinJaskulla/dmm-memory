import { Effect } from '../effectMiddleware';
import { GameCardMatchable, Move } from '../../hooks/useGame';
import { pickRandom } from '../../utils/pickRandom';

// Trick — Unflips one pair of matched word cards but flips over another pair of words.

const EFFECT = 'trick';

export const trickEffect: Effect = {
  effectId: EFFECT,
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

      // MMXT
      // If by chance choice1 is part of the new match, choice1 needs to be reset
      // MMXXT
      // If by chance one of the choices is part of the new match, it needs to be reset.
      if (nextMove.matched.has(nextMove.choice1)) nextMove.choice1 = '';
      if (nextMove.matched.has(nextMove.choice2)) nextMove.choice2 = '';
    },
  },
};
