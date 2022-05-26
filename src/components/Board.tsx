import React from 'react';
import { HiddenCard, HiddenCardProps } from './Cards/HiddenCard';
import { RevealedCard, RevealedCardProps } from './Cards/RevealedCard';
import { EffectCard, EffectCardProps } from './Cards/EffectCard';
import { MatchedCard, MatchedCardProps } from './Cards/MatchedCard';
import styled from 'styled-components';

const StyledMain = styled.main`
  --card-width: 100px;
  --card-height: calc(var(--card-width) * 1.5);
  --grid-gap: calc(var(--card-width) / 4);
  --columns: 4;
  --gutters: calc(var(--columns) - 1);

  margin: 0 auto;
  padding: 32px;
  max-width: calc(var(--grid-gap) * var(--gutters) + var(--card-width) * var(--columns));
  display: grid;
  grid-template-columns: repeat(auto-fit, var(--card-width));
  grid-auto-rows: var(--card-height);
  grid-gap: var(--grid-gap);
  justify-content: center;
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
