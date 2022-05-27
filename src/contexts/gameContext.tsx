import React, { useEffect, useState } from 'react';
import { useCards } from '../utils/useCards';

export interface GameCardMatchable {
  type: 'matchable';
  id: number;
  text: string;
  language: 'en' | 'ja';
}

export interface GameCardEffect {
  type: 'effect';
  effect: 'timer' | 'shuffle' | 'retry' | 'trick';
}

export type GameCard = GameCardMatchable | GameCardEffect;

type Index = number;
type Id = number;

export interface GameContextValue {
  choice1: Index | null;
  choice2: Index | null;
  matches: Set<Id>;
  foundEffects: Set<Index>;
  cards: GameCard[];
  revealCard: (index: Index) => void;
}

const defaultValue: GameContextValue = {
  cards: [],
  choice1: null,
  choice2: null,
  matches: new Set(),
  foundEffects: new Set(),
  revealCard: () => null,
};

const GameContext = React.createContext<GameContextValue>(defaultValue);

interface GameProviderProps {
  children: React.ReactNode;
}

const GameProvider = ({ children }: GameProviderProps) => {
  const [cards] = useCards(defaultValue.cards);
  const [choice1, setChoice1] = useState<GameContextValue['choice1']>(defaultValue.choice1);
  const [choice2, setChoice2] = useState<GameContextValue['choice2']>(defaultValue.choice2);
  const [matches, setMatches] = useState<GameContextValue['matches']>(defaultValue.matches);
  const [foundEffects, setFoundEffects] = useState<GameContextValue['foundEffects']>(defaultValue.foundEffects);

  function revealCard(index: number) {
    const type = cards[index].type;
    let newChoice1 = choice1;
    let newChoice2 = choice2;

    if (typeof choice1 === 'number' && typeof choice2 === 'number') {
      newChoice1 = null;
      newChoice2 = null;
    }

    switch (type) {
      case 'matchable':
        if (newChoice1 === null) {
          newChoice1 = index;
        } else if (newChoice2 === null) {
          newChoice2 = index;
        }
        break;
      case 'effect': {
        const newFoundEffects = new Set(foundEffects);
        newFoundEffects.add(index);
        setFoundEffects(newFoundEffects);
        break;
      }
    }
    setChoice1(newChoice1);
    setChoice2(newChoice2);
    // Check here if it is a match or in a new useEffect, with dependencies of revealed1 and 2
  }

  useEffect(() => {
    if (typeof choice1 !== 'number' || typeof choice2 !== 'number') return;
    const card1 = cards[choice1];
    const card2 = cards[choice2];
    if (card1.type !== 'matchable' || card2.type !== 'matchable')
      throw new Error('Only matchable cards should be choices');
    if (card1.id === card2.id) {
      const newMatches = new Set(matches);
      newMatches.add(card1.id);
      setMatches(newMatches);
      setChoice1(null);
      setChoice2(null);
    }
  }, [choice1, choice2, matches, cards]);

  const providerValue: GameContextValue = {
    cards: cards,
    choice1: choice1,
    choice2: choice2,
    matches: matches,
    foundEffects,
    revealCard,
  };

  return <GameContext.Provider value={providerValue}>{children}</GameContext.Provider>;
};

function useGame(): GameContextValue {
  return React.useContext(GameContext);
}

export { GameProvider, useGame };
