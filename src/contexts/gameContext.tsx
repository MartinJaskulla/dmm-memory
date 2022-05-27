import React, { useState } from 'react';

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
  revealedIndex1: number | null;
  revealedIndex2: number | null;
  matchedIds: Set<number>;
  cards: GameCard[];
  revealCard: (index: number) => void;
}

const defaultValue: GameContextValue = {
  cards: [],
  revealedIndex1: null,
  revealedIndex2: null,
  matchedIds: new Set(),
  revealCard: () => null,
};

const GameContext = React.createContext<GameContextValue>(defaultValue);

interface GameProviderProps {
  children: React.ReactNode;
}

const GameProvider = ({ children }: GameProviderProps) => {
  const [cards] = useState<GameContextValue['cards']>(defaultValue.cards);
  const [revealedIndex1, setRevealedIndex1] = useState<GameContextValue['revealedIndex1']>(defaultValue.revealedIndex1);
  const [revealedIndex2, setRevealedIndex2] = useState<GameContextValue['revealedIndex2']>(defaultValue.revealedIndex2);
  const [matchedIds] = useState<GameContextValue['matchedIds']>(defaultValue.matchedIds);
  function revealCard(index: number) {
    if (revealedIndex1 === null) {
      return setRevealedIndex1(index);
    }
    if (revealedIndex2 === null) {
      return setRevealedIndex2(index);
    }
    // Check here if it is a match or better in a new useEffect, with dependencies of revealed1 and 2
  }

  // const [loading, setLoading] = useState<GameContextValue['loading']>(false);
  //
  // async function loadProduct(ean: string) {
  //   setLoading(true);
  //   const response = await api.get<Product>(endpoints.loadProduct(ean));
  //   setProduct(response.data);
  //   setLoading(false);
  // }

  const providerValue: GameContextValue = {
    cards: cards,
    revealedIndex1,
    revealedIndex2,
    matchedIds,
    revealCard,
  };

  return <GameContext.Provider value={providerValue}>{children}</GameContext.Provider>;
};

function useGame(): GameContextValue {
  return React.useContext(GameContext);
}

export { GameProvider, useGame };
