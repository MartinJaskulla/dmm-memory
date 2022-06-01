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
  const {
    history: { move },
  } = game;
  // if moves === 0. show cards for x seconds

  return (
    <>
      <StyledMain>
        {move.cardIds.map((cardId, index) => {
          const card = move.cards[cardId];
          if (card.type === 'matchable') {
            if (move.matched.has(card.id)) {
              return <MatchedCard key={card.id} text={card.text} language={card.language} />;
            }
            const isCardRevealed = [move.choice1, move.choice2].includes(card.id);
            if (isCardRevealed || move.gameOver) {
              return (
                <RevealedCard
                  key={card.id}
                  text={card.text}
                  language={card.language}
                  onClick={twoChoices(move) ? () => game.revealCard(index) : undefined}
                />
              );
            }
          }

          if (card.type === 'effect' && (move.foundEffects.has(card.id) || move.gameOver)) {
            return <EffectCard key={card.id} text={card.text} />;
          }

          return <HiddenCard key={card.id} onClick={() => game.revealCard(index)} />;
        })}
      </StyledMain>
    </>
  );
}
