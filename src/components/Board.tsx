import React from 'react';
import { HiddenCard } from './Cards/HiddenCard';
import { RevealedCard } from './Cards/RevealedCard';
import { EffectCard } from './Cards/EffectCard';
import { MatchedCard } from './Cards/MatchedCard';
import styled from 'styled-components';
import { useGame } from '../features/useGame';
import { twoChoices } from '../utils/choices';

const StyledDiv = styled.div`
  display: grid;
  place-items: center;
  min-height: calc(100vh - var(--header-height));
`;

const StyledMain = styled.main`
  width: 30rem;
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
    <StyledDiv>
      <StyledMain>
        {game.move.cardIds.map((cardId, index) => {
          const card = game.move.cards[cardId];
          const hasHighlight = game.move.highlighted.has(cardId) && !game.move.gameOver;
          const isDisabled = game.move.disabled.has(cardId);

          if (card.type === 'matchable') {
            if (game.move.matched.has(card.cardId)) {
              return (
                <MatchedCard key={card.cardId} lang={card.language} highlight={hasHighlight}>
                  {card.text}
                </MatchedCard>
              );
            }

            const isCardRevealed = [game.move.choice1, game.move.choice2].includes(card.cardId);
            const isHintCard = game.move.hinted.has(card.cardId);
            if (isCardRevealed || isHintCard || game.move.gameOver) {
              return (
                <RevealedCard
                  key={card.cardId}
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

          if (card.type === 'effect' && (game.move.foundEffects.has(card.cardId) || game.move.gameOver)) {
            return (
              <EffectCard key={card.cardId} highlight={hasHighlight}>
                {card.text}
              </EffectCard>
            );
          }

          return (
            <HiddenCard
              key={card.cardId}
              onClick={!isDisabled ? () => game.revealCard(index) : undefined}
              highlight={hasHighlight}
            />
          );
        })}
      </StyledMain>
    </StyledDiv>
  );
}
