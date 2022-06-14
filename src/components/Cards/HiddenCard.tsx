import React from 'react';
import { BaseCard, BaseCardProps } from './BaseCard';
import owlImgSrc from '../../images/owl.svg';
import styled from 'styled-components';

const StyledBaseCard = styled(BaseCard)`
  border-color: var(--color-flipped);
  background: var(--color-flipped);
  box-shadow: 0 14px 18px rgba(0, 0, 0, 0.25);

  div {
    width: 50%;
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    border-radius: 100vh;
    background: var(--color-white);
    border: 1px solid var(--color-text);
    img {
      width: 50%;
    }
  }
`;

export function HiddenCard(props: Pick<BaseCardProps, 'highlight' | 'onClick'>) {
  return (
    <StyledBaseCard {...props}>
      <div>
        <img alt="Memory Game Logo" src={owlImgSrc} />
      </div>
    </StyledBaseCard>
  );
}
