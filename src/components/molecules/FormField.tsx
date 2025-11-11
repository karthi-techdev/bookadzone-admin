import React, { memo, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import LabeledInput from './LabeledInput';
import { useMemoizedField } from '../hooks/useMemoizedField';
import type { FieldConfig, FieldValue, FormFieldChangeEvent } from '../types/common';

interface FormFieldProps<T = FieldValue> {
  field: FieldConfig;
  value: T;
  onChange?: (event: FormFieldChangeEvent<T>) => void;
  onClick?: () => void;
  readOnly?: boolean;
  error?: string;

  isAuth?: boolean;
  existingFiles?: string | string[];
}

const FormField = memo(<T extends FieldValue = FieldValue>({ 
  field, 
  value, 
  onChange, 
  onClick,
  readOnly = false,
  error, 

  isAuth,
  existingFiles
}: FormFieldProps<T>) => {
  const { clearErrors } = useFormContext();

  const normalizedOptions = React.useMemo(() => 
    Array.isArray(field.options)
      ? field.options.map((opt) =>
          typeof opt === 'string' ? { label: opt, value: opt } : opt
        )
      : undefined,
    [field.options]
  );

  const handleChange = useCallback((e: FormFieldChangeEvent<T>) => {
    clearErrors(field.name);
    onChange?.(e);
  }, [clearErrors, field.name, onChange]);

  return (
    <div className={field.className || 'space-y-2'}>
      <LabeledInput
        name={field.name}
        label={field.label}
        type={field.type}
        value={value}
        onChange={handleChange}
        
        onClick={onClick}
        readOnly={readOnly} 
        placeholder={field.placeholder}
        disabled={field.disabled}
        options={normalizedOptions}
        accept={field.accept}
        multiple={field.multiple}
        valueAsNumber={field.valueAsNumber}
        error={error}
        required={field.required}

        isAuth={isAuth}
        existingFiles={existingFiles} 
      />
    </div>
  );
});

FormField.displayName = 'FormField';

export default FormField;