import React from 'react';
import { useFormContext } from 'react-hook-form';
import LabeledInput from './LabeledInput';
import type { FieldConfig } from '../types/common';

interface FormFieldProps {
  field: FieldConfig;
  value: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  error?: string;
  togglePassword?: () => void;
  showPassword?: boolean;
  isAuth?:boolean;
}

const FormField: React.FC<FormFieldProps> = ({ field, value, onChange, error, togglePassword, showPassword ,isAuth}) => {
  const { clearErrors } = useFormContext();

  const normalizedOptions = Array.isArray(field.options)
    ? field.options.map((opt) =>
        typeof opt === 'string' ? { label: opt, value: opt } : opt
      )
    : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    // Clear errors for this field
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
      />
    </div>
  );
};

export default FormField;