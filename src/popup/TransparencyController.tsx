import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { ColorRing } from 'react-loader-spinner';
import { Slider } from '@mui/material';

const ControllerWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
`;

const ToggleTitle = styled.span`
  margin-top: 1rem;
  margin-left: 0.5rem;
  font-weight: 400;
  font-size: 1rem;
  font-family: Arial, sans-serif;
`;

const SliderWrapper = styled.div`
  width: 70%;
  position: relative;
  padding: 0.5rem;
`;

export default function TransparencyController() {
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState(70);

  useEffect(() => {
    chrome.storage.local.get('transparency', (data) => {
      setValue(data.transparency);
      setIsLoading(false);
    });
  }, []);

  const handleChange = useCallback((e, newValue) => {
    setValue(() => {
      chrome.storage.local.set({ transparency: newValue });
      return newValue;
    });
  }, []);

  return (
    <ControllerWrapper>
      <ToggleTitle>투명도: </ToggleTitle>
      <SliderWrapper>
        {isLoading && (
          <ColorRing
            visible
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
          />
        )}
        {!isLoading && <Slider value={value} aria-label="Default" valueLabelDisplay="auto" onChange={handleChange} />}
      </SliderWrapper>
    </ControllerWrapper>
  );
}
