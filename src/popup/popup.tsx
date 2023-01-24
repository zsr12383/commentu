import React from 'react';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import Toggle from './toggle';
import Header from './header';

const GlobalStyle = createGlobalStyle`
  ${reset}
`;

const Main = styled.main`
  width: 12rem;
  height: 10rem;
  background: #f4f4f4;
`;

const Footer = styled.footer`
  margin-bottom: 0;
  width: 12rem;
  height: 1rem;
  box-shadow: inset 0 0 0 5000px rgb(241 247 253);
  position: relative;
`;

const Email = styled.span`
  position: absolute;
  right: 1rem;
  font-family: Arial, sans-serif;
  font-size: 0.3rem;
`;

function Popup() {
  return (
    <>
      <Header />
      <Main>
        <Toggle />
      </Main>
      <Footer>
        <Email>zsr12383@gmail.com</Email>
      </Footer>
    </>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <Popup />
  </React.StrictMode>,
  document.getElementById('root'),
);
