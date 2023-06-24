import { GameCard, Move, NO_COUNTDOWN } from '../useHistory/useHistoryValue';
import { oneChoice, twoChoices, zeroChoices } from '../../utils/choices';
import { GAME_OVER } from '../../config/gameOver';
import { CONFIG } from '../../config/config';
import { applyEffects } from '../../effects/applyEffects';
import { explainEffect } from '../../effects/explainEffect';

export class Game {
  static nextMove({
    cardIndex,
    currentMove,
    msPlayed,
  }: {
    cardIndex: number;
    currentMove: Move;
    msPlayed: number;
  }): Move {
    const nextMove: Move = structuredClone(currentMove);

    const cardId = nextMove.cardIds[cardIndex];
    nextMove.latestCard = cardId;

    const card = nextMove.cards[cardId];
    Game.flipCards(nextMove, card);
    Game.checkMatch(nextMove);

    nextMove.msPlayed = msPlayed;
    nextMove.hinted = new Set();

    Game.startCountdown(nextMove);

    explainEffect(nextMove);
    applyEffects(nextMove);
    Game.winIfAllPairsFound(nextMove);
    return nextMove;
  }

  static flipCards(nextMove: Move, card: GameCard): void {
    if (twoChoices(nextMove)) {
      nextMove.choice1 = '';
      nextMove.choice2 = '';
    }
    switch (card.type) {
      case 'matchable': {
        // Flip one card
        if (zeroChoices(nextMove)) {
          nextMove.choice1 = card.cardId;
        } else if (oneChoice(nextMove)) {
          nextMove.choice2 = card.cardId;
        }
        break;
      }
      case 'effect': {
        nextMove.foundEffects.add(card.cardId);
        break;
      }
    }
  }

  static checkMatch(nextMove: Move): void {
    const card1 = nextMove.cards[nextMove.choice1];
    const card2 = nextMove.cards[nextMove.choice2];
    if (card1?.type === 'matchable' && card2?.type === 'matchable') {
      if (card1.matchId === card2.matchId) {
        nextMove.matched.add(card1.cardId);
        nextMove.matched.add(card2.cardId);
        nextMove.choice1 = '';
        nextMove.choice2 = '';
      }
    }
  }

  static startCountdown(nextMove: Move): void {
    if (nextMove.msPerMove === NO_COUNTDOWN && oneChoice(nextMove)) {
      nextMove.msPerMove = CONFIG.TIME_PER_MOVE;
    }
  }

  static winIfAllPairsFound(nextMove: Move): void {
    if (!nextMove.gameOver && nextMove.matched.size / 2 === CONFIG.PAIRS) {
      nextMove.gameOver = GAME_OVER.FOUND_ALL_PAIRS;
    }
  }
}
