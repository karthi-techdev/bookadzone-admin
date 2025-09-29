import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FiAlertCircle } from 'react-icons/fi';
import LabeledInput from './LabeledInput';
import type { FieldConfig } from '../types/common';

interface FormFieldProps {
  field: FieldConfig;
  value: any;
  onChange?: (e: { target: { name: string; value: any; removedFiles?: string[] } }) => void;
  error?: string;
  togglePassword?: () => void;
  showPassword?: boolean;
  isAuth?: boolean;
  existingFiles?: string | string[];
}

const FormField: React.FC<FormFieldProps> = ({ 
  field, 
  value, 
  onChange, 
  error, 
  togglePassword, 
  showPassword, 
  isAuth,
  existingFiles
}) => {
  const { clearErrors } = useFormContext();

  const normalizedOptions = Array.isArray(field.options)
    ? field.options.map((opt) =>
        typeof opt === 'string' ? { label: opt, value: opt } : opt
      )
    : undefined;

  const handleChange = (e: { target: { name: string; value: any; removedFiles?: string[] } }) => {
    clearErrors(field.name);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className={field.className || 'space-y-2'}>
      <LabeledInput
        name={field.name}
        label={field.label}
        type={field.type}
        value={value}
        onChange={handleChange}
        placeholder={field.placeholder}
        disabled={field.disabled}
        options={normalizedOptions}
        accept={field.accept}
        multiple={field.multiple}
        valueAsNumber={field.valueAsNumber}
        error={error}
        required={field.required}
        togglePassword={togglePassword}
        showPassword={showPassword}
        isAuth={isAuth}
        existingFiles={existingFiles} 
      />
    </div>
  );
};

export default FormField;