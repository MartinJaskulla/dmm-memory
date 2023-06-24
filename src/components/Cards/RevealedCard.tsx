import React from 'react';
import { BaseCard, BaseCardProps } from 'src/components/Cards/BaseCard';
import styled from 'styled-components';

const StyledBaseCard = styled(BaseCard)`
  border-color: var(--color-flipped);
`;

export function RevealedCard(props: Pick<BaseCardProps, 'children' | 'highlight' | 'lang' | 'onClick'>) {
  return <StyledBaseCard {...props} disabled />;
}
