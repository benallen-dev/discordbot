import React from 'react';
import styled from 'styled-components';

import { User, UserProps } from './user';

export const VoiceListWrapper = styled.div`
  background-color: #2F3136;
  box-sizing: border-box;
  height: 480px;
  width: 320px;
  padding: 16px;
`;

interface VoiceListProps {
  users: UserProps[];
}

export const VoiceList = (props: VoiceListProps) => (
  <VoiceListWrapper>
    {props.users.map(user => {
      return <User key={user.id} {...user} />
    })}
  </VoiceListWrapper>
);
