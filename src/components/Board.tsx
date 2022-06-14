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

  return (
    <>
      <StyledMain>
        {game.move.cardIds.map((cardId, index) => {
          const card = game.move.cards[cardId];
          const hasHighlight = game.move.highlights.has(cardId) && !game.move.gameOver;
          const isDisabled = game.move.disabled.has(cardId);

          if (card.type === 'matchable') {
            if (game.move.matched.has(card.id)) {
              return (
                <MatchedCard key={card.id} lang={card.language} highlight={hasHighlight}>
                  {card.text}
                </MatchedCard>
              );
            }

            const isCardRevealed = [game.move.choice1, game.move.choice2].includes(card.id);
            const isHintCard = game.move.hints.has(card.id);
            if (isCardRevealed || isHintCard || game.move.gameOver) {
              return (
                <RevealedCard
                  key={card.id}
                  lang={card.language}
                  onClick={
                    !isDisabled && (twoChoices(game.move) || isHintCard) ? () => game.revealCard(index) : undefined
                  }
                  highlight={hasHighlight}
                >
                  {card.text}
                </RevealedCard>
              );
            }
          }

          if (card.type === 'effect' && (game.move.foundEffects.has(card.id) || game.move.gameOver)) {
            return (
              <EffectCard key={card.id} highlight={hasHighlight}>
                {card.text}
              </EffectCard>
            );
          }

          return (
            <HiddenCard
              key={card.id}
              onClick={!isDisabled ? () => game.revealCard(index) : undefined}
              highlight={hasHighlight}
            />
          );
        })}
      </StyledMain>
    </>
  );
}
