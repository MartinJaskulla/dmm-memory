import React from 'react';
import { HiddenCard } from './Cards/HiddenCard';
import { RevealedCard } from './Cards/RevealedCard';
import { EffectCard } from './Cards/EffectCard';
import { MatchedCard } from './Cards/MatchedCard';
import styled from 'styled-components';
import { useGame } from '../features/useGame';
import { twoChoices } from '../utils/choices';

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

  // if moves === 0. show cards for x seconds

  return (
    <>
      <StyledMain>
        {game.cardIds.map((cardId, index) => {
          const card = game.cards[cardId];
          if (card.type === 'matchable') {
            if (game.matched.has(card.id)) {
              return <MatchedCard key={card.id} text={card.text} language={card.language} />;
            }
            const isCardRevealed = [game.choice1, game.choice2].includes(card.id);
            if (isCardRevealed || game.over) {
              return (
                <RevealedCard
                  key={card.id}
                  text={card.text}
                  language={card.language}
                  onClick={twoChoices(game) ? () => game.revealCard(index) : undefined}
                />
              );
            }
          }

          if (card.type === 'effect' && (game.foundEffects.has(card.id) || game.over)) {
            return <EffectCard key={card.id} text={card.effect} />;
          }

          return <HiddenCard key={card.id} onClick={() => game.revealCard(index)} />;
        })}
      </StyledMain>
    </>
  );
}
