import React, { memo } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import type { FieldConfig } from '../types/common';
import FormField from '../molecules/FormField';
import Button from './BAZ-Button';

interface DynamicFieldProps {
  index: number;
  fields: FieldConfig[];
  values: Record<string, any>;
  errors: Record<string, any>;
  onFieldChange: (fieldName: string) => (e: { target: { name: string; value: any } }) => void;
  onRemove: () => void;
  fieldNamePrefix: string;
}

const DynamicField = memo(({
  index,
  fields,
  values,
  errors,
  onFieldChange,
  onRemove,
  fieldNamePrefix
}: DynamicFieldProps) => {
  return (
    <div className="bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center">
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {fields.map((field) => {
          const fieldPath = `${fieldNamePrefix}.${index}.${field.name}`;
          return (
            <FormField
              key={fieldPath}
              field={{ ...field, name: fieldPath }}
              value={values[fieldPath]}
              onChange={onFieldChange(fieldPath)}
              error={errors[fieldPath]?.message}
            />
          );
        })}
      </div>
      <Button
        type="button"
        onClick={onRemove}
        className="text-red-400 hover:text-red-300 p-2"
      >
        <FiTrash2 className="h-5 w-5" />
      </Button>
    </div>
  );
});

export default DynamicField;