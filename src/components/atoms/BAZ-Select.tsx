import React from 'react';
import Select from 'react-select';
import { FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import type { MultiValue, SingleValue, ActionMeta } from 'react-select';
import type { SelectOption } from '../types/common';

interface CustomSelectProps {
  options: SelectOption[];
  value?: SelectOption | SelectOption[] | null;
  onChange?: (value: SelectOption | SelectOption[] | null) => void;
  className?: string;
  placeholder?: string;
  isMulti?: boolean;
  error?: string;
  label?: string;
  id?: string;
  disabled?: boolean;
}

const BAZSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  id,
  onChange,
  className = '',
  placeholder = 'Select...',
  isMulti = false,
  error,
  label,
  disabled,
}) => {
  const handleChange = (
    newValue: MultiValue<SelectOption> | SingleValue<SelectOption>,
    _: ActionMeta<SelectOption>
  ) => {
    if (isMulti) {
      onChange?.([...(newValue as MultiValue<SelectOption>)]);
    } else {
      onChange?.(newValue as SingleValue<SelectOption>);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`space-y-2 ${className}`}
    >
      {label && (
        <label 
          className="block text-xs text-[var(--light-grey-color)]"
          htmlFor={id}                  
        >
          {label}
        </label>
      )}
      <Select
        inputId={id}                 
        options={options}
        value={value as any}
        onChange={handleChange}
        isMulti={isMulti}
        placeholder={placeholder}
        classNamePrefix="react-select"
        isDisabled={disabled}
        data-testid={id ? `${id}-input` : undefined}
        closeMenuOnSelect={!isMulti}
        hideSelectedOptions={isMulti ? false : undefined}
        styles={{
          control: (base) => ({
            ...base,
            backgroundColor: 'var(--dark-color)',
            borderColor: error ? '#f87171' : 'var(--light-blur-grey-color)',
            color: 'white',
            '&:hover': { borderColor: error ? '#f87171' : 'var(--puprle-color)' },
            boxShadow: 'none',
          }),
          singleValue: (base) => ({ ...base, color: 'white' }),
          menu: (base) => ({ ...base, backgroundColor: 'var(--dark-color)' }),
          option: (base, { isFocused }) => ({
            ...base,
            backgroundColor: isFocused ? 'var(--puprle-color)' : 'var(--dark-color)',
            color: 'white',
          }),
          placeholder: (base) => ({ ...base, color: 'var(--light-grey-color)' }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: 'var(--puprle-color)',
          }),
          multiValueLabel: (base) => ({ ...base, color: 'white' }),
          multiValueRemove: (base) => ({
            ...base,
            color: 'white',
            '&:hover': {
              backgroundColor: '#f87171',
              color: 'white',
            },
          }),
        }}
      />
      {error && (
        <p className="text-xs text-red-400 flex items-center mt-1">
          <FiAlertCircle className="mr-1" /> {error}
        </p>
      )}
    </motion.div>
  );
};

export default BAZSelect;
