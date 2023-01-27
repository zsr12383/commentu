import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';

const ToggleWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
`;

const CheckBoxWrapper = styled.div`
  position: relative;
  padding: 0.5rem;
  margin-left: 0.5rem;
`;

const ToggleTitle = styled.span`
  margin-top: 0.4rem;
  margin-left: 0.5rem;
  font-weight: 400;
  font-size: 0.8rem;
  font-family: Arial, sans-serif;
`;

const CheckBoxLabel = styled.label`
  position: absolute;
  top: 14px;
  left: 24px;
  width: 42px;
  height: 26px;
  border-radius: 16px;
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

export default function Toggle() {
  const [isLoading, setIsLoading] = useState(true);
  const [isToggled, setIsToggled] = useState(false);

  useEffect(() => {
    chrome.storage.local.get('enabled', (data) => {
      setIsToggled(data.enabled);
      setIsLoading(false);
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
    <ToggleWrapper>
      <ToggleTitle>switch: </ToggleTitle>
      <CheckBoxWrapper>
        {!isLoading && (
          <>
            <CheckBox id="checkbox" type="checkbox" checked={isToggled} onChange={handleToggle} />
            <CheckBoxLabel htmlFor="checkbox" />
          </>
        )}
      </CheckBoxWrapper>
    </ToggleWrapper>
  );
}
