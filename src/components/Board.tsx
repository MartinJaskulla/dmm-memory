import React from 'react';
import { HiddenCard, HiddenCardProps } from './Cards/HiddenCard';
import { RevealedCard, RevealedCardProps } from './Cards/RevealedCard';
import { EffectCard, EffectCardProps } from './Cards/EffectCard';
import { MatchedCard, MatchedCardProps } from './Cards/MatchedCard';
import styled from 'styled-components';

const StyledMain = styled.main`
  margin: 0 auto;
  padding: 32px 0;
  max-width: 90vw;
  width: 35rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1.5rem;
  justify-content: center;

  & > * {
    aspect-ratio: 2 / 3;
  }
`;

type BoardCard = HiddenCardProps | RevealedCardProps | MatchedCardProps | EffectCardProps;

export interface BoardProps {
  cards: BoardCard[];
}

export function Board(props: BoardProps) {
  return (
    <StyledMain>
      {props.cards.map((card, index) => {
        switch (card.type) {
          case 'matched':
            return <MatchedCard key={index} {...card} />;
          case 'hidden':
            return <HiddenCard key={index} {...card} />;
          case 'revealed':
            return <RevealedCard key={index} {...card} />;
          case 'effect':
            return <EffectCard key={index} {...card} />;
        }
      })}
    </StyledMain>
  );
}
