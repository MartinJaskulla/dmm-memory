import React from 'react';
import { BaseCard } from './BaseCard';
import owlImgSrc from '../../images/owl.svg';
import styled from 'styled-components';

const StyledBaseCard = styled(BaseCard)`
  border-color: var(--color-flipped);
  background: var(--color-flipped);
  box-shadow: 0 14px 18px rgba(0, 0, 0, 0.25);
  cursor: pointer;

  &:focus,
  &:hover {
    outline: none;
    transform: scale(1.05);
  }

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

export interface HiddenCardProps {
  type: 'hidden';
}

export function HiddenCard(props: HiddenCardProps) {
  console.log(props);
  return (
    <StyledBaseCard>
      <div>
        <img alt="Memory Game Logo" src={owlImgSrc} />
      </div>
    </StyledBaseCard>
  );
}
