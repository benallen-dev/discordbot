import React from 'react';
import styled from 'styled-components';

const DisplayNameWrapper = styled.div<{speaking?: boolean;}>`
  line-height: 24px;
  font-size: 20px;
  font-family: freight-sans-pro,sans-serif;
  font-weight: 600;
  font-style: normal;
  color: ${props => props.speaking ? '#fbfbfb' : '#8e9297'};
`;

interface DisplayNameProps {
  displayName: string;
  speaking?: boolean;
}

export const DisplayName = (props: DisplayNameProps) => {
  const {
    displayName,
    speaking
  } = props;

  return (
    <div style={{ flex: 1 }}>
      <DisplayNameWrapper speaking={speaking}>
        {displayName}
      </DisplayNameWrapper>
    </div>
  );
};