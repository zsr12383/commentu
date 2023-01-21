import React, { useCallback, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const CheckBoxWrapper = styled.div`
  position: relative;
`;
const CheckBoxLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 42px;
  height: 26px;
  border-radius: 15px;
  background: #bebebe;
  cursor: pointer;
  &::after {
    content: '';
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`;
const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 42px;
  height: 26px;
  &:checked + ${CheckBoxLabel} {
    background: #4fbe79;
    &::after {
      content: '';
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 21px;
      transition: 0.2s;
    }
  }
`;

function Popup() {
  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {
    chrome.storage.local.get('enabled', (data) => {
      setIsToggled(data.enabled);
    });
  }, []);

  const handleToggle = useCallback(() => {
    setIsToggled((prevIsToggled) => {
      const nextStatus = !prevIsToggled;
      chrome.storage.local.set({ enabled: nextStatus });
      return nextStatus;
    });
  }, []);

  return (
    <CheckBoxWrapper>
      <CheckBox id="checkbox" type="checkbox" checked={isToggled} onChange={handleToggle} />
      <CheckBoxLabel htmlFor="checkbox" />
    </CheckBoxWrapper>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('root'),
);
