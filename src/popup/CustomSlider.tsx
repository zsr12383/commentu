import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import Slider from '@mui/material/Slider';

const ControllerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const ToggleTitle = styled.span`
  margin-top: 1rem;
  margin-left: 0.5rem;
  font-weight: 500;
  font-size: 0.8rem;
  font-family: Inter, sans-serif;
`;

const SliderWrapper = styled.div`
  width: 50%;
  padding: 0.5rem;
`;

interface PropsType {
  keyName: string;
  min: number;
  max: number;
  initial: number;
  step: number;
}

export default function CustomSlider({ keyName, min, max, initial, step }: PropsType) {
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState(initial);

  useEffect(() => {
    chrome.storage.local.get(keyName, (data) => {
      setValue(data[keyName]);
      setIsLoading(false);
    });
  }, []);

  const handleChange = useCallback((e, newValue) => {
    setValue(() => {
      chrome.storage.local.set({ [keyName]: newValue });
      return newValue;
    });
  }, []);

  return (
    <ControllerWrapper>
      <ToggleTitle>{keyName}</ToggleTitle>
      <SliderWrapper>
        {!isLoading && (
          <Slider
            value={value}
            min={min}
            max={max}
            step={step}
            aria-label="Default"
            valueLabelDisplay="auto"
            onChange={handleChange}
          />
        )}
      </SliderWrapper>
    </ControllerWrapper>
  );
}
