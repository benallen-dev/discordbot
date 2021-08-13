import React from 'react';
import styled from 'styled-components';

interface AvatarProps {
  avatarUrl: string;
  speaking?: boolean;
}

const AvatarBox = styled.div`
  width: 48px;
  margin-right: 16px;
`;

const AvatarRadius = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Image = styled.div<AvatarProps>`
  width: 42px;
  height: 42px;
  border-radius: 21px;
  background: url(${props => props.avatarUrl}) #ff0070;
  background-size: 42px;
  background-position: center;
  box-sizing: border-box;
  border: ${props => props.speaking ? '2px solid #2F3337' : 'none'};
  box-shadow: ${props => props.speaking ? '0 0 0 3px #43B581;' : 'none'};
`;

export const Avatar = (props: AvatarProps) => {
  const {
    avatarUrl,
    speaking
  } = props;

  return (
    <AvatarBox>
      <AvatarRadius>
        <Image avatarUrl={avatarUrl} speaking={speaking} />
      </AvatarRadius>
    </AvatarBox>
  );
};