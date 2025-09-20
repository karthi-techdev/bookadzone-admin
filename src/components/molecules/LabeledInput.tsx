import React, { memo } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import BAZInput from '../atoms/BAZ-Input';
import BAZTextArea from '../atoms/BAZ-TextArea';
import BAZCheckbox from '../atoms/BAZ-Checkbox';
import BAZRadio from '../atoms/BAZ-Radio';
import BAZSelect from '../atoms/BAZ-Select';
import BAZFileInput from '../atoms/BAZ-FileInput';
import type { InputType, SelectOption } from '../types/common';

interface LabeledInputProps {
  name: string;
  label?: string;
  type: InputType;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  options?: SelectOption[];
  className?: string;
  disabled?: boolean;
  accept?: string;
  multiple?: boolean;
  valueAsNumber?: boolean;
  error?: string;
  togglePassword?: () => void;
  showPassword?: boolean;
  isAuth?: boolean;
}

const LabeledInput: React.FC<LabeledInputProps> = memo(
  ({
    name,
    label,
    type,
    value,
    onChange,
    placeholder,
    required,
    disabled,
    options = [],
    className = '',
    accept,
    multiple = false,
    valueAsNumber = false,
    isAuth=false,
    error,
    togglePassword,
    showPassword,
  }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      if (!onChange) return;
      onChange(e);
    };

    const selectChangeHandler = (selected: SelectOption | SelectOption[] | null) => {
      if (!onChange) return;
      const value = multiple
        ? (selected as SelectOption[])?.map((opt) => opt.value) || []
        : (selected as SelectOption)?.value || '';
      onChange({
        target: { name, value } as any,
      } as React.ChangeEvent<HTMLSelectElement>);
    };

    const renderInput = () => {
      switch (type) {
        case 'textarea':
          return (
            <>
              <BAZTextArea
                id={name}
                name={name}
                value={value || ''}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                error={undefined}
                className="w-full"
              />
              {error && (
                <p className="text-xs text-red-400 flex items-center mt-1">
                  <FiAlertCircle className="mr-1" /> {error}
                </p>
              )}
            </>
          );
        case 'checkbox':
          return (
            <BAZCheckbox
              id={name}
              name={name}
              checked={!!value}
              onChange={handleChange}
              disabled={disabled}
              error={error}
            />
          );
        case 'radio':
          return (
            <BAZRadio
              name={name}
              selectedValue={value || ''}
              onChange={handleChange}
              options={options}
              disabled={disabled}
              error={error}
            />
          );
        case 'select':
        case 'country-select':
        case 'state-select':
        case 'city-select':
          return (
            <BAZSelect
              id={name}
              options={options}
              value={multiple ? value : options.find((opt) => opt.value === value) || null}
              onChange={selectChangeHandler}
              placeholder={placeholder}
              isMulti={multiple}
              disabled={disabled}
              error={error}
            />
          );
        case 'file':
          return (
            <BAZFileInput
              name={name}
              value={value}
              onChange={handleChange}
              accept={accept}
              multiple={multiple}
              disabled={disabled}
              error={error}
            />
          );
        default:
          return (
            <div className="relative">
              <BAZInput
                id={name}
                name={name}
                type={type}
                value={type === 'number' && value != null ? value : value || ''}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                error={error}
                isAuth={isAuth}
                className="outline-none w-full"
              />
              {name === 'password' && togglePassword && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[1rem] text-[var(--light-grey-color)] hover:text-[var(--white-color)] focus:outline-none"
                  onClick={togglePassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              )}
            </div>
          );
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
          <label htmlFor={name} className="block text-xs text-[var(--light-grey-color)]">
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        {renderInput()}
      </motion.div>
    ); 
  }
);

export default LabeledInput;