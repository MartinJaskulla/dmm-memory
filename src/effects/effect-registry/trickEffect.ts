import { Effect } from '../effectMiddleware';
import { GameCardMatchable, Move } from '../../features/useGame';
import { random } from '../../utils/random';

// Trick — Unflips one pair of matched word cards but flips over another pair of words.

const EFFECT = 'trick';

export const trickEffect: Effect = {
  effectId: EFFECT,
  card: {
    text: 'Trick',
  },
  middleware: {
    cardClick: (move: Move) => {
      const atLeastOneMatch = move.matched.size >= 2;
      if (atLeastOneMatch) {
        const nonMatchedCards: GameCardMatchable[] = [];
        const matchedCards: GameCardMatchable[] = [];
        Object.values(move.cards)
          .filter((card): card is GameCardMatchable => card.type === 'matchable')
          .forEach((card) => (move.matched.has(card.id) ? matchedCards.push(card) : nonMatchedCards.push(card)));

        const newMatchId = nonMatchedCards[random(0, nonMatchedCards.length - 1)].matchId;
        const newMatchCardIds = nonMatchedCards.filter((card) => card.matchId === newMatchId).map((card) => card.id);

        const oldMatchId = matchedCards[random(0, move.matched.size - 1)].matchId;
        const oldMatchCardIds = matchedCards.filter((card) => card.matchId === oldMatchId).map((card) => card.id);

        oldMatchCardIds.forEach((cardId) => move.matched.delete(cardId));
        newMatchCardIds.forEach((cardId) => move.matched.add(cardId));

        // MMXT
        // If by chance choice1 is part of the new match, choice1 needs to be reset
        // MMXXT
        // If by chance one of the choices is part of the new match, it needs to be reset.
        if (move.matched.has(move.choice1)) move.choice1 = '';
        if (move.matched.has(move.choice2)) move.choice2 = '';
      }
    },
  },
};
