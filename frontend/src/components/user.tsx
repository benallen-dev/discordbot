import React from 'react';
import styled from 'styled-components';

import { Avatar } from './avatar';
import { DisplayName } from './displayname';

const UserWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 50px;
`;

export interface UserProps {
  id: string;
  avatarUrl: string;
  displayName: string;
  speaking?: boolean;
  muted?: boolean;
  deafened?: boolean;
}

export const User = (props: UserProps) => {
  const {
    avatarUrl,
    displayName,
    speaking,
    muted,
    deafened
  } = props;

  console.log(props);

  return (
    <UserWrapper>
      <Avatar avatarUrl={avatarUrl} speaking={speaking} />
      <DisplayName displayName={displayName} speaking={speaking} />
      {/* muted/defeaned goes here */}
    </UserWrapper>
  );
};