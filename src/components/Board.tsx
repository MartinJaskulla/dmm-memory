import React from 'react';
import { HiddenCard } from './Cards/HiddenCard';
import { RevealedCard } from './Cards/RevealedCard';
import { EffectCard } from './Cards/EffectCard';
import { MatchedCard } from './Cards/MatchedCard';
import styled from 'styled-components';
import { useHistory } from '../hooks/useHistory/useHistory';
import { useGame } from '../hooks/useGame/useGame';

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
  const history = useHistory();
  const game = useGame();

  return (
    <StyledDiv>
      <StyledMain>
        {history.move.cardIds.map((cardId, index) => {
          const card = history.move.cards[cardId];
          const hasHighlight = history.move.highlighted.has(cardId) && !history.move.gameOver;

          if (card.type === 'matchable') {
            if (history.move.matched.has(card.cardId)) {
              return (
                <MatchedCard key={card.cardId} lang={card.language} highlight={hasHighlight}>
                  {card.text}
                </MatchedCard>
              );
            }

            const isCardRevealed = [history.move.choice1, history.move.choice2].includes(card.cardId);
            const isHintCard = history.move.hinted.has(card.cardId);
            if (isCardRevealed || isHintCard || history.move.gameOver) {
              return (
                <RevealedCard key={card.cardId} lang={card.language} highlight={hasHighlight}>
                  {card.text}
                </RevealedCard>
              );
            }
          }

          if (card.type === 'effect' && (history.move.foundEffects.has(card.cardId) || history.move.gameOver)) {
            return (
              <EffectCard key={card.cardId} highlight={hasHighlight}>
                {card.text}
              </EffectCard>
            );
          }

          return <HiddenCard key={card.cardId} onClick={() => game.revealCard(index)} highlight={hasHighlight} />;
        })}
      </StyledMain>
    </StyledDiv>
  );
}
