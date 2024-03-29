import React from 'react';
import { HiddenCard } from 'src/components/Cards/HiddenCard';
import { RevealedCard } from 'src/components/Cards/RevealedCard';
import { EffectCard } from 'src/components/Cards/EffectCard';
import { MatchedCard } from 'src/components/Cards/MatchedCard';
import styled from 'styled-components';
import { useHistory } from 'src/hooks/useHistory/useHistory';
import { useGame } from 'src/hooks/useGame/useGame';
import { Card3D } from 'src/components/Card3D';
import FlipMove from 'react-flip-move';

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
        <FlipMove typeName={null}>
          {history.move.cardIds.map((cardId, index) => {
            const card = history.move.cards[cardId];
            const hasHighlight = history.move.highlighted.has(cardId) && !history.move.gameOver;

            let back;
            let flipped = false;

            if (card.type === 'matchable') {
              const isMatch = history.move.matched.has(card.cardId);
              back = isMatch ? (
                <MatchedCard lang={card.language} highlight={hasHighlight}>
                  {card.text}
                </MatchedCard>
              ) : (
                <RevealedCard lang={card.language} highlight={hasHighlight}>
                  {card.text}
                </RevealedCard>
              );

              const isCardRevealed = [history.move.choice1, history.move.choice2].includes(card.cardId);
              const isHintCard = history.move.hinted.has(card.cardId);
              if (isCardRevealed || isHintCard || isMatch || history.move.gameOver) {
                flipped = true;
              }
            } else if (card.type === 'effect') {
              back = (
                <EffectCard key={card.cardId} highlight={hasHighlight}>
                  {card.text}
                </EffectCard>
              );
              if (history.move.foundEffects.has(card.cardId) || history.move.gameOver) {
                flipped = true;
              }
            }

            return (
              <div key={card.cardId}>
                <Card3D
                  flipped={flipped}
                  front={
                    <HiddenCard
                      key={card.cardId}
                      disabled={flipped}
                      onClick={() => game.revealCard(index)}
                      highlight={hasHighlight}
                    />
                  }
                  back={back}
                />
              </div>
            );
          })}
        </FlipMove>
      </StyledMain>
    </StyledDiv>
  );
}
