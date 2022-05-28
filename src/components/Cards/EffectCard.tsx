import React from 'react';
import { BaseCard } from './BaseCard';
import rocketImgSrc from '../../images/rocket.svg';
import styled from 'styled-components';
import { GameCardEffect } from '../../contexts/gameContext';

const StyledBaseCard = styled(BaseCard)`
  border-color: var(--color-trick);

  img {
    width: 50%;
  }
`;

export type EffectCardProps = GameCardEffect;

export function EffectCard(props: EffectCardProps) {
  const text = props.effect.charAt(0).toUpperCase() + props.effect.slice(1);
  return (
    <StyledBaseCard>
      <img alt="Memory Game Logo" src={rocketImgSrc} />
      {text}
    </StyledBaseCard>
  );
}
