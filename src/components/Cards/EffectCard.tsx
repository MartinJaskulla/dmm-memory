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

export type EffectCardProps = {
  text: string;
};

export function EffectCard(props: EffectCardProps) {
  return (
    <StyledBaseCard>
      <img alt="Memory Game Logo" src={rocketImgSrc} />
      {props.text}
    </StyledBaseCard>
  );
}
