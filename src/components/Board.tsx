import React from 'react';
import { HiddenCard } from './Cards/HiddenCard';
import { RevealedCard } from './Cards/RevealedCard';
import { EffectCard } from './Cards/EffectCard';
import { MatchedCard } from './Cards/MatchedCard';
import styled from 'styled-components';
import { useGame } from '../features/useGame';

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

export function Board() {
  const game = useGame();

  return (
    <StyledMain>
      {game.cards.map((card, index) => {
        if (card.type === 'matchable') {
          if (game.matches.has(card.id)) {
            return <MatchedCard key={index} text={card.text} language={card.language} />;
          }
          const isCardRevealed = [game.choice1, game.choice2].includes(index);
          if (isCardRevealed) {
            const areBothChoicesRevealed = typeof game.choice1 === 'number' && typeof game.choice2 === 'number';
            return (
              <RevealedCard
                key={index}
                text={card.text}
                language={card.language}
                onClick={areBothChoicesRevealed ? () => game.revealCard(index) : undefined}
              />
            );
          }
        }

        if (card.type === 'effect' && game.foundEffects.has(index)) {
          return <EffectCard key={index} text={card.effect} />;
        }

        return <HiddenCard key={index} onClick={() => game.revealCard(index)} />;
      })}
    </StyledMain>
  );
}
