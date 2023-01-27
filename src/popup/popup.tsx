import React from 'react';
import ReactDOM from 'react-dom';
import styled, { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import Toggle from './toggle';
import Header from './header';
import CustomSlider from './CustomSlider';

const GlobalStyle = createGlobalStyle`
  ${reset}
`;

const Main = styled.main`
  width: 16rem;
  height: 10rem;
  background: #f4f4f4;
  padding-left: 1rem;
  padding-top: 0.5rem;
`;

const Footer = styled.footer`
  margin-bottom: 0;
  width: 100%;
  height: 1rem;
  box-shadow: inset 0 0 0 5000px rgb(241 247 253);
  position: relative;
`;

const Email = styled.a`
  position: absolute;
  right: 1rem;
  font-family: Arial, sans-serif;
  font-size: 0.3rem;
  text-decoration: none;
`;

function Popup() {
  return (
    <>
      <Header />
      <Main>
        <Toggle />
        <CustomSlider keyName="opacity" min={0} max={100} initial={70} step={1} />
        <CustomSlider keyName="duration" min={0.5} max={10} initial={5} step={0.1} />
      </Main>
      <Footer>
        <Email href="mailto:zsr12383@gmail.com">zsr12383@gmail.com</Email>
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
