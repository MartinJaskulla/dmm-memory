import React from 'react';
import { BaseCard } from './BaseCard';
import rocketImgSrc from '../../images/rocket.svg';
import styled from 'styled-components';

const StyledBaseCard = styled(BaseCard)`
  border-color: var(--color-trick);
  img {
    width: 50%;
  }
`;

export interface EffectCardProps {
  type: 'effect';
  effect: 'timer' | 'shuffle' | 'retry' | 'trick';
}

export function EffectCard(props: EffectCardProps) {
  const text = props.effect.charAt(0).toUpperCase() + props.effect.slice(1);
  return (
    <StyledBaseCard tabIndex={-1}>
      <img alt="Memory Game Logo" src={rocketImgSrc} />
      {text}
    </StyledBaseCard>
  );
}
