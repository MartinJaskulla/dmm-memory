import React, { useState } from 'react';
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

export interface GameContextValue {
  choiceIndex1: number | null;
  choiceIndex2: number | null;
  matchedIds: Set<number>;
  cards: GameCard[];
  revealCard: (index: number) => void;
}

const defaultValue: GameContextValue = {
  cards: [],
  choiceIndex1: null,
  choiceIndex2: null,
  matchedIds: new Set(),
  revealCard: () => null,
};

const GameContext = React.createContext<GameContextValue>(defaultValue);

interface GameProviderProps {
  children: React.ReactNode;
}

const GameProvider = ({ children }: GameProviderProps) => {
  const [cards] = useCards(defaultValue.cards);
  const [choiceIndex1, setChoiceIndex1] = useState<GameContextValue['choiceIndex1']>(defaultValue.choiceIndex1);
  const [choiceIndex2, setChoiceIndex2] = useState<GameContextValue['choiceIndex2']>(defaultValue.choiceIndex2);
  const [matchedIds] = useState<GameContextValue['matchedIds']>(defaultValue.matchedIds);
  function revealCard(index: number) {
    if (choiceIndex1 === null) {
      return setChoiceIndex1(index);
    }
    if (choiceIndex2 === null) {
      return setChoiceIndex2(index);
    }
    // Check here if it is a match or better in a new useEffect, with dependencies of revealed1 and 2
  }

  const providerValue: GameContextValue = {
    cards: cards,
    choiceIndex1,
    choiceIndex2,
    matchedIds,
    revealCard,
  };

  return <GameContext.Provider value={providerValue}>{children}</GameContext.Provider>;
};

function useGame(): GameContextValue {
  return React.useContext(GameContext);
}

export { GameProvider, useGame };
