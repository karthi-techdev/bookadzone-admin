import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiCheck, FiPlus, FiTrash2 } from 'react-icons/fi';
import FormField from '../molecules/FormField';
import type { FieldConfig } from '../types/common';
import Button from '../atoms/BAZ-Button';
import { toast } from 'react-toastify';

interface ManagementFormProps {
  label: string;
  fields: FieldConfig[];
  isSubmitting?: boolean;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  ['data-testid']?: string;
  onButtonClick?: () => void;
  existingFileName?: string;
  isAuth?: boolean;
  isDynamic?: boolean;
  dynamicFieldName?: string;
  dynamicFieldConfig?: FieldConfig[];
  onFieldChange?: { [key: string]: (e: { target: { name: string; value: any } }) => void };
  toastErrorMessage?: string;
  extraProps?: { togglePassword?: () => void; showPassword?: boolean };
}

const ManagementForm: React.FC<ManagementFormProps> = ({
  label,
  fields,
  isSubmitting,
  onSubmit,
  onButtonClick,
  existingFileName,
  isAuth = false,
  isDynamic = false,
  dynamicFieldName = 'dynamicFields',
  dynamicFieldConfig = [],
  ['data-testid']: dataTestId,
  onFieldChange = {},
  toastErrorMessage = 'Please fill out the previous field completely before adding a new one.',
  extraProps = {},
}) => {
  const { control, formState: { errors }, getValues, setValue } = useFormContext();
  const { fields: dynamicFields, append, remove } = useFieldArray({
    control,
    name: dynamicFieldName,
  });

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

  const canAddNewField = () => {
    if (dynamicFields.length === 0) return true;
    const lastIndex = dynamicFields.length - 1;
    const lastFieldValues = getValues(`${dynamicFieldName}[${lastIndex}]`) || {};
    return lastFieldValues.key && lastFieldValues.value;
  };

  const handleAddField = () => {
    if (!canAddNewField()) {
      toast.error(toastErrorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    append({ key: '', value: '' });
  };

  if (isAuth) {
    return (
      <motion.form
        onSubmit={handleButtonClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col justify-center items-center w-full"
        data-testid={dataTestId}
      >
        <div className="w-full space-y-2">
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
                togglePassword={field.name === 'password' ? extraProps.togglePassword : undefined}
                showPassword={field.name === 'password' ? extraProps.showPassword : undefined}
                isAuth={isAuth}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 w-full flex justify-center">
          <Button
            type="submit"
            className="p-3 bg-[var(--puprle-color)] text-[var(--white-color)] font-medium text-[.75rem] cursor-pointer rounded-tl-[5px] rounded-tr-[20px] rounded-bl-[20px] rounded-br-[5px] w-full disabled:opacity-50"
            disabled={isSubmitting}
          >
          
            {isSubmitting ? 'Submitting...' : label}
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
      className="bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl shadow-sm p-6"
      data-testid={dataTestId}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {fields.map((field) => (
          <div key={field.name} className={field.className || 'md:col-span-6 col-span-12'}>
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
              togglePassword={field.name === 'password' ? extraProps.togglePassword : undefined}
              showPassword={field.name === 'password' ? extraProps.showPassword : undefined}
            />
            {field.type === 'file' && existingFileName && (
              <p className="text-xs text-[var(--light-grey-color)] mt-1">
                Previously uploaded: <strong>{existingFileName}</strong>
              </p>
            )}
          </div>
        ))}
        {isDynamic && dynamicFieldConfig.length > 0 && (
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
            <div className="space-y-4">
              {dynamicFields.map((dynamicField, index) => (
                <div
                  key={dynamicField.id}
                  className="bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center"
                >
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    {dynamicFieldConfig.map((dField) => (
                      <FormField
                        key={`${dynamicFieldName}.${index}.${dField.name}`}
                        field={{ ...dField, name: `${dynamicFieldName}.${index}.${dField.name}` }}
                        value={getValues(`${dynamicFieldName}.${index}.${dField.name}`)}
                        onChange={(e) => {
                          setValue(`${dynamicFieldName}.${index}.${dField.name}`, e.target.value, { shouldValidate: true });
                        }}
                        error={getNestedError(errors, `${dynamicFieldName}.${index}.${dField.name}`)}
                      />
                    ))}
                  </div>
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-400 hover:text-red-300 p-2"
                    disabled={dynamicFields.length === 1}
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              onClick={handleAddField}
              className="mt-4 flex items-center px-4 py-2 bg-[var(--puprle-color)] hover:bg-[var(--puprle-color)]/90 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <FiPlus className="mr-1" />
              Add Field
            </Button>
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