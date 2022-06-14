import React from 'react';
import styled, { css } from 'styled-components';
import { Language } from '../../api/fetchGoal';

const StyledButton = styled.button<BaseCardProps>`
  border-radius: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  padding: 0;
  background: none;
  border: 5px solid var(--color-text);

  &:focus-visible {
    outline: none;
    transform: scale(1.05);
  }

  ${(props) =>
    props.onClick
      ? css`
          cursor: pointer;

          &:focus,
          &:hover {
            outline: none;
            transform: scale(1.05);
          }
        `
      : null}

  ${(props) =>
    props.highlight
      ? css`
          outline-style: dashed;
        `
      : null}
`;

export type BaseCardProps = React.HTMLAttributes<HTMLButtonElement> & { lang?: Language; highlight: boolean };

export function BaseCard(props: BaseCardProps) {
  return (
    <StyledButton {...props} tabIndex={props.onClick ? 0 : -1}>
      {props.children}
    </StyledButton>
  );
}

/*
The Base & Variants pattern might look unusual at first, but after having worked in component libraries with hundreds of components,
I see a lot of advantages.

Single component:
Most projects have e.g. a single button component, which has the code for all variants. As more variants are added, the button file
grows large and consumers are importing code that they do not need. For example a page displays <Button variant="primary">,
but the component contains dozens of variants more e.g. "secondary", "disabled", "warn" etc. internally.
You also escape the "boolean trap". With Base & Variants pattern there is no more "(isPrimary || isSecondary) && !loading && ...":
https://spicefactory.co/blog/2019/03/26/how-to-avoid-the-boolean-trap-when-designing-react-components/

Base & Variants:
- The base component allows you to restrict which properties can be overwritten and therefore enforcing your
design system (here I allow maximum flexibility by allowing all HTMLButton attributes)
- You can add functionality to all buttons by modifying the base component
- Consumers are only importing the code they need for the variant they are using

More information:
- How AirBnb designs components (Base & Variants pattern): https://www.youtube.com/watch?v=UxoX2faIgDQ&t=23291s
- Lessons from creative writing for component design: https://www.youtube.com/watch?v=JDDxR1a15Yo&t=9337s
 */
