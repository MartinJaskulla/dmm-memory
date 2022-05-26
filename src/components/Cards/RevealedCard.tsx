import React from 'react';
import { BaseCard } from './BaseCard';
import styled from 'styled-components';

const StyledBaseCard = styled(BaseCard)`
  border-color: var(--color-flipped);
`;

export interface RevealedCardProps {
  type: 'revealed';
  text: string;
  language: 'en' | 'ja';
}

export function RevealedCard(props: RevealedCardProps) {
  return <StyledBaseCard lang={props.language}>{props.text}</StyledBaseCard>;
}
