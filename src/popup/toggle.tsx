import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';

const ToggleWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  height: 3rem;
`;

const ToggleTitle = styled.span`
  margin-top: 0.4rem;
  margin-left: 0.5rem;
  font-weight: 500;
  font-size: 0.8rem;
  font-family: Inter, sans-serif;
`;

const CheckBoxLabel = styled.label`
  margin-top: 4px;
  margin-right: 8px;
  display: block;
  width: 32px;
  height: 16px;
  border-radius: 16px;
  background: #bebebe;
  cursor: pointer;

  &::after {
    content: '';
    display: block;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`;

const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  width: 0px;
  height: 0px;

  &:checked + ${CheckBoxLabel} {
    background: #4fbe79;

    &::after {
      content: '';
      display: block;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      margin-left: 16px;
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
      <ToggleTitle>switch </ToggleTitle>
      {!isLoading && (
        <>
          <CheckBox id="checkbox" type="checkbox" checked={isToggled} onChange={handleToggle} />
          <CheckBoxLabel htmlFor="checkbox" />
        </>
      )}
    </ToggleWrapper>
  );
}
