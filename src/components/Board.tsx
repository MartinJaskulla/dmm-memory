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
          if (game.matched.has(card.id)) {
            return <MatchedCard key={card.id} text={card.text} language={card.language} />;
          }
          const isCardRevealed = [game.choice1, game.choice2].includes(card.id);
          if (isCardRevealed) {
            const areBothChoicesRevealed = typeof game.choice1 === 'string' && typeof game.choice2 === 'string';
            return (
              <RevealedCard
                key={card.id}
                text={card.text}
                language={card.language}
                onClick={areBothChoicesRevealed ? () => game.revealCard(index) : undefined}
              />
            );
          }
        }

        if (card.type === 'effect' && game.foundEffects.has(card.id)) {
          return <EffectCard key={card.id} text={card.effect} />;
        }

        return <HiddenCard key={card.id} onClick={() => game.revealCard(index)} />;
      })}
    </StyledMain>
  );
}
