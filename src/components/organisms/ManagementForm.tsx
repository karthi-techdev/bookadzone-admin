import React from 'react';
import { useFormContext } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import FormField from '../molecules/FormField';
import type { FieldConfig } from '../types/common';
import Button from '../atoms/BAZ-Button';

interface ManagementFormProps {
  label: string;
  fields: FieldConfig[];
  isSubmitting?: boolean;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  ['data-testid']?: string;
  onButtonClick?: () => void;
  existingFileName?: string;
  isLogin?: boolean;
  isDynamic?: boolean;
  dynamicFieldName?: string;
  dynamicFieldConfig?: FieldConfig[];
  onFieldChange?: {
    [key: string]: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  };
}

const ManagementForm: React.FC<ManagementFormProps> = ({
  label,
  fields,
  isSubmitting,
  onSubmit,
  onButtonClick,
  existingFileName,
  isLogin = false,
  isDynamic = false,
  dynamicFieldName = 'dynamicFields',
  dynamicFieldConfig = [],
  ['data-testid']: dataTestId,
  onFieldChange = {},
}) => {
  const { control, formState: { errors }, getValues, setValue } = useFormContext();

  const getNestedError = (errors: any, name: string): string | undefined => {
    const parts = name.split('.');
    let current: any = errors;
    for (const part of parts) {
      if (!current) return undefined;
      current = current[part];
    }
    return current?.message;
  };

  const handleButtonClick = (e: React.FormEvent<HTMLFormElement>) => {
    if (onButtonClick) {
      e.preventDefault();
      onButtonClick();
    } else if (onSubmit) {
      onSubmit(e);
    }
  };

  if (isLogin) {
    return (
      <motion.form
        onSubmit={handleButtonClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col justify-center items-center w-full"
        data-testid={dataTestId}
      >
        <div className="w-full space-y-6">
          {fields.map((field) => (
            <div key={field.name} className="w-full">
              <FormField
                field={field}
                value={getValues(field.name)}
                onChange={onFieldChange[field.name] || ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                  if (field.type === 'file' && 'files' in e.target && e.target.files) {
                    setValue(field.name, e.target.files[0], { shouldValidate: true });
                  } else if (field.type === 'checkbox') {
                    setValue(field.name, (e as React.ChangeEvent<HTMLInputElement>).target.checked, { shouldValidate: true });
                  } else {
                    setValue(field.name, e.target.value, { shouldValidate: true });
                  }
                })}
                error={getNestedError(errors, field.name)}
              />
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-end w-full">
          <Button
            type="submit"
            className="flex items-center px-4 py-2 bg-[var(--puprle-color)] hover:bg-[var(--puprle-color)]/90 text-white rounded-lg text-sm font-medium transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : label}
          </Button>
        </div>
      </motion.form>
    );
  }

  return (
    <motion.form
      onSubmit={handleButtonClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl shadow-sm p-6 ${isLogin ? 'w-full' : ''}`}
      data-testid={dataTestId}
    >
      <div className={isLogin ? 'space-y-6' : 'grid grid-cols-1 md:grid-cols-12 gap-6'}>
        {fields.map((field) => (
          <div key={field.name} className={isLogin ? 'w-full' : field.className || 'md:col-span-6 col-span-12'}>
            <FormField
              field={field}
              value={getValues(field.name)}
              onChange={onFieldChange[field.name] || ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                if (field.type === 'file' && 'files' in e.target && e.target.files) {
                  setValue(field.name, e.target.files[0], { shouldValidate: true });
                } else if (field.type === 'checkbox') {
                  setValue(field.name, (e as React.ChangeEvent<HTMLInputElement>).target.checked, { shouldValidate: true });
                } else {
                  setValue(field.name, e.target.value, { shouldValidate: true });
                }
              })}
              error={getNestedError(errors, field.name)}
            />
            {field.type === 'file' && existingFileName && (
              <p className="text-xs text-[var(--light-grey-color)] mt-1">
                Previously uploaded: <strong>{existingFileName}</strong>
              </p>
            )}
          </div>
        ))}
        {isDynamic && (
          <div className="md:col-span-12 col-span-12">
            <h4 className="text-sm font-semibold text-white mb-4">Dynamic Fields</h4>
            {dynamicFieldConfig.map((field, index) => (
              <FormField
                key={`${dynamicFieldName}.${index}`}
                field={field}
                value={getValues(`${dynamicFieldName}.${index}.${field.name}`)}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
                  const updatedFields = [...(getValues(dynamicFieldName) || [])];
                  updatedFields[index] = {
                    ...updatedFields[index],
                    [field.name]: field.type === 'file' && 'files' in e.target && e.target.files
                      ? e.target.files[0]
                      : field.type === 'checkbox'
                      ? (e as React.ChangeEvent<HTMLInputElement>).target.checked
                      : e.target.value,
                  };
                  setValue(dynamicFieldName, updatedFields, { shouldValidate: true });
                }}
                error={getNestedError(errors, `${dynamicFieldName}.${index}.${field.name}`)}
              />
            ))}
          </div>
        )}
      </div>
      <div className="mt-8 flex justify-end">
        <Button
          type="submit"
          className="flex items-center px-4 py-2 bg-[var(--puprle-color)] hover:bg-[var(--puprle-color)]/90 text-white rounded-lg text-sm font-medium transition-colors"
          disabled={isSubmitting}
        >
          <FiCheck className="mr-1" />
          {isSubmitting ? 'Submitting...' : label}
        </Button>
      </div>
    </motion.form>
  );
};

export default React.memo(ManagementForm);