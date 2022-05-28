import React from 'react';
import { BaseCard } from './BaseCard';
import styled from 'styled-components';

const StyledBaseCard = styled(BaseCard)`
  border-color: var(--color-matched);
`;

export interface MatchedCardProps {
  type: 'matched';
  text: string;
  language: 'en' | 'ja';
}

export function MatchedCard(props: MatchedCardProps) {
  return <StyledBaseCard lang={props.language}>{props.text}</StyledBaseCard>;
}
