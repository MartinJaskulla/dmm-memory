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
  onClick?: () => void;
}

export function RevealedCard(props: RevealedCardProps) {
  return (
    <StyledBaseCard tabIndex={-1} lang={props.language} onClick={props.onClick}>
      {props.text}
    </StyledBaseCard>
  );
}
