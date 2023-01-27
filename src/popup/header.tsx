import React from 'react';
import styled from 'styled-components';
import bridge from './bridge48.png';

const HeaderContainer = styled.div`
  width: 100%;
  height: 2rem;
  box-shadow: inset 0 0 0 5000px rgb(241 247 253);
  display: flex;
  justify-content: left;
  align-items: center;
  padding: 1rem;
  font-family: Arial, sans-serif;
  border-bottom: green 1px solid;
`;

const H1 = styled.h1`
  margin-left: 0.5rem;
  font-weight: 500;
  font-size: 1.2rem;
`;

const Version = styled.span`
  margin-left: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.3rem;
`;

export default function Header() {
  return (
    <header>
      <HeaderContainer>
        <img src={bridge} alt="at popup page commentu's logo" height="32px" />
        <H1>commentu</H1>
        <Version>1.0.5</Version>
      </HeaderContainer>
    </header>
  );
}
