import { Snapshot } from './gameContext';

export function flipCards(snapshot: Snapshot, revealedCardIndex: number): Snapshot {
  const nextSnapshot = structuredClone(snapshot);

  // Update choices
  if (typeof nextSnapshot.choice1 === 'number' && typeof nextSnapshot.choice2 === 'number') {
    nextSnapshot.choice1 = null;
    nextSnapshot.choice2 = null;
  }

  const revealedCardType = nextSnapshot.cards[revealedCardIndex].type;
  switch (revealedCardType) {
    case 'matchable':
      if (nextSnapshot.choice1 === null) {
        nextSnapshot.choice1 = revealedCardIndex;
      } else if (nextSnapshot.choice2 === null) {
        nextSnapshot.choice2 = revealedCardIndex;
      }
      break;
    case 'effect': {
      nextSnapshot.foundEffects.add(revealedCardIndex);
      break;
    }
  }

  // Update matches
  if (typeof nextSnapshot.choice1 === 'number' && typeof nextSnapshot.choice2 === 'number') {
    const card1 = nextSnapshot.cards[nextSnapshot.choice1];
    const card2 = nextSnapshot.cards[nextSnapshot.choice2];
    if (card1.type !== 'matchable' || card2.type !== 'matchable')
      throw new Error('Only matchable cards should be choices');
    if (card1.id === card2.id) {
      nextSnapshot.matches.add(card1.id);
      nextSnapshot.choice1 = null;
      nextSnapshot.choice2 = null;
    }
  }

  return nextSnapshot;
}
