import React from 'react';
import owlImgSrc from '../images/owl.svg';
import styled from 'styled-components';

const StyledHeader = styled.header`
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  color: white;
  padding: 12px 16px;

  h1 {
    color: var(--color-text);
    font-size: 24px;
    font-weight: 700;
    line-height: 1.5;
    margin: 0;
  }

  img {
    height: 1.2em;
    object-fit: contain;
    vertical-align: middle;
    width: auto;
  }
`;

export function Header() {
  return (
    <StyledHeader>
      <h1>
        <img alt="Memory Game Logo" src={owlImgSrc} />
        Memory Game
      </h1>
    </StyledHeader>
  );
}
