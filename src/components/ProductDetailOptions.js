import React, { useState,useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
// Components
import InputOption from './InputOption';
import RadioGroupOption from './RadioGroupOption';
import { CheckboxOption } from './CheckboxOption.tsx';
import SelectBoxOption from './SelectBoxOption';
import ImageOption from './ImageOption';

export const ProductDetailOptions = ({
  options,
  selectedOptions,
  changeOptionHandler,
  navigation,
  onOptionsChange
}) => {
  const [localSelectedOptions, setLocalSelectedOptions] = useState(selectedOptions);

  useEffect(() => {
    onOptionsChange(localSelectedOptions);
  }, [localSelectedOptions, onOptionsChange]);

  const handleOptionChange = (optionId, value) => {
    setLocalSelectedOptions(prevOptions => ({
      ...prevOptions,
      [optionId]: value
    }));
    changeOptionHandler(optionId, value);
  };

  const renderOptionItem = item => {
    const option = { ...item };
    const defaultValue = localSelectedOptions[item.selectDefaultId];

    switch (item.option_type) {
      case 'P':
        return (
          <ImageOption
            option={option}
            value={defaultValue}
            key={uuidv4()}
            onChange={val => handleOptionChange(option.selectDefaultId, val)}
          />
        );
      case 'T':
        return (
          <InputOption
            option={option}
            value={defaultValue}
            key={uuidv4()}
            onChange={val => handleOptionChange(option.selectDefaultId, val)}
          />
        );
      case 'I':
        return (
          <InputOption
            option={option}
            value={defaultValue}
            key={uuidv4()}
            onChange={val => handleOptionChange(option.selectDefaultId, val)}
          />
        );
      case 'S':
        return (
          <SelectBoxOption
            option={option}
            value={defaultValue}
            key={uuidv4()}
            navigation={navigation}
            onChange={val => handleOptionChange(option.selectDefaultId, val)}
          />
        );
      case 'R':
        return (
          <RadioGroupOption
            option={option}
            value={defaultValue}
            key={uuidv4()}
            onChange={val => handleOptionChange(option.selectDefaultId, val)}
          />
        );
      case 'C':
        return (
          <CheckboxOption
            option={option}
            value={defaultValue}
            key={uuidv4()}
            onChange={val => handleOptionChange(option.selectDefaultId, val)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {options.map(option => renderOptionItem(option))}
    </>
  );
};