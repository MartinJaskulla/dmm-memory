import React from 'react';
import { BaseCard, BaseCardProps } from './BaseCard';
import rocketImgSrc from '../../images/rocket.svg';
import styled from 'styled-components';

const StyledBaseCard = styled(BaseCard)`
  border-color: var(--color-trick);

  img {
    width: 50%;
  }
`;

export function EffectCard(props: Pick<BaseCardProps, 'children' | 'highlight' | 'lang'>) {
  return (
    <StyledBaseCard highlight={props.highlight} lang={'en'} disabled>
      <img alt="Memory Game Logo" src={rocketImgSrc} />
      {props.children}
    </StyledBaseCard>
  );
}
