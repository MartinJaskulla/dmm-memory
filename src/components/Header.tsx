import React from 'react';
import owlImgSrc from '../images/owl.svg';
import styled from 'styled-components';
import { Countdown } from './Countdown';
import { StopWatch } from './StopWatch';
import { TimeTravel } from './TimeTravel';

const StyledHeader = styled.header`
  height: var(--header-height);
  padding: 0 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  color: var(--color-text);
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.5;
    margin: 0;
  }

  img {
    height: 1.2em;
    object-fit: contain;
    vertical-align: middle;
    width: auto;
    margin-right: 8px;
  }
`;

export function Header() {
  return (
    <StyledHeader>
      <h1>
        <img alt="Memory Game Logo" src={owlImgSrc} />
        Memory Game
      </h1>
      <TimeTravel />
      <div>
        <StopWatch />
        <Countdown />
      </div>
    </StyledHeader>
  );
}
