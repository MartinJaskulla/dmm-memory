import React from 'react';
import { BaseCard, BaseCardProps } from './BaseCard';
import styled from 'styled-components';

const StyledBaseCard = styled(BaseCard)`
  border-color: var(--color-matched);
`;

export function MatchedCard(props: Pick<BaseCardProps, 'children' | 'highlight' | 'lang'>) {
  return <StyledBaseCard {...props} />;
}
