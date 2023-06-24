import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'src/hooks/useHistory/useHistory';

const StyledInput = styled.input`
  margin-right: 1rem;
`;

export function TimeTravel() {
  const history = useHistory();

  return (
    <div>
      <StyledInput
        type="range"
        step="1"
        min="0"
        max={history.moves.length - 1}
        value={history.moveIndex}
        onChange={(event) => history.goToMove(Number(event.target.value))}
      />
      <span>🧳 {history.moveIndex}</span>
    </div>
  );
}
