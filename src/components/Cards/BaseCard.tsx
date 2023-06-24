import React, { ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { Language } from 'src/api/fetchGoal';

const StyledButton = styled.button<BaseCardProps>`
  color: var(--color-text);
  border-radius: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  padding: 0;
  background: var(--color-white);
  border: 5px solid var(--color-text);
  box-shadow: 0 14px 18px rgba(0, 0, 0, 0.25);

  &:focus-visible {
    outline: 5px solid var(--color-focus-ring);
  }

  ${(props) =>
    props.onClick &&
    css`
      cursor: pointer;
    `}

  ${(props) =>
    props.highlight &&
    css`
      outline-style: dashed;
    `}
`;

export type BaseCardProps = ButtonHTMLAttributes<HTMLButtonElement> & { lang?: Language; highlight: boolean };

export function BaseCard(props: BaseCardProps) {
  return <StyledButton {...props}>{props.children}</StyledButton>;
}

/*
Base & Variants pattern:
- How AirBnb designs components (Base & Variants pattern): https://www.youtube.com/watch?v=UxoX2faIgDQ&t=23291s

- The base component allows you to restrict which properties can be overwritten and therefore enforcing your
design system (here I allow maximum flexibility by allowing all HTMLButton attributes)
- You can add functionality to all buttons by modifying the base component
- Consumers of variant components are only importing the code they need for the variant they are using
 */
