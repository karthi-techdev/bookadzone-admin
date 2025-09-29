import React, { useEffect, useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiCheck, FiPlus, FiTrash2 } from 'react-icons/fi';
import FormField from '../molecules/FormField';
import type { FieldConfig } from '../types/common';
import Button from '../atoms/BAZ-Button';
import { toast } from 'react-toastify';
import BAZJodiEdit from '../atoms/BAZ-Jodit';
import BAZModal from '../atoms/BAZ-Modal';
import BAZTextArea from '../atoms/BAZ-TextArea';
import BAZInput from '../atoms/BAZ-Input';

interface ManagementFormProps {
  label: string;
  fields: FieldConfig[];
  isSubmitting?: boolean;
  isJodit?: boolean;
  isInitialized?: boolean;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  ['data-testid']?: string;
  onButtonClick?: () => void;
  existingFileName?: string;
  existingFiles?: { [key: string]: string | string[] };
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
  existingFiles = {},
  isAuth = false,
  isDynamic = false,
  isJodit = false,
  dynamicFieldName = 'dynamicFields',
  dynamicFieldConfig = [],
  ['data-testid']: dataTestId,
  onFieldChange = {},
  toastErrorMessage = 'Please fill out the previous field completely before adding a new one.',
  extraProps = {},
}) => {
  const { control, formState: { errors }, getValues, setValue, register, watch } = useFormContext();
  const [isEditorOpen, setIsEditorOpen] = useState(false);

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
      toast.error(toastErrorMessage, { position: 'top-right', autoClose: 3000 });
      return;
    }
    append({ key: '', value: '' });
  };

  // Ensure 'template' is registered when Jodit editor is used
  useEffect(() => {
    if (isJodit) {
      register('template');
    }
  }, [isJodit, register]);

  return (
    <motion.form
      onSubmit={handleButtonClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={isAuth ? 'flex flex-col justify-center items-center w-full' : 'bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl shadow-sm p-6'}
      data-testid={dataTestId || (isAuth ? 'auth-form' : 'management-form')}
    >
      <div className={isAuth ? 'w-full space-y-2' : 'grid grid-cols-1 md:grid-cols-12 gap-6'}>
        {fields.map((field) => {
          const fieldError = getNestedError(errors, field.name);
          const isTemplateEditor = isJodit && field.name === 'template';
          const isTemplatePreview = !isJodit && field.name === 'template' && field.readOnly;
          if (isTemplateEditor) {
            return (
              <div key={field.name} className={field.className || (isAuth ? 'w-full' : 'md:col-span-12 col-span-12')}>
                <BAZTextArea
                  name={field.name}
                  label={field.label}
                  value={watch('template') || ''}
                  placeholder={field.placeholder || 'Enter template'}
                  onClick={() => setIsEditorOpen(true)}
                  onChange={(e: any) => setValue('template', e.target.value, { shouldValidate: true, shouldDirty: true })}
                  disabled={field.disabled}
                  error={fieldError}
                  className="w-full"
                />
                {existingFileName && field.type === 'file' && (
                  <div className="mt-2 text-xs text-[var(--light-grey-color)]">
                    <span>Previously uploaded:</span> <span>{existingFileName}</span>
                  </div>
                )}
              </div>
            );
          }

          if (isTemplatePreview) {
            const stripHtml = (html: string) => {
              const div = document.createElement('div');
              div.innerHTML = html || '';
              return div.textContent || div.innerText || '';
            };
            return (
              <div key={field.name} className={field.className || (isAuth ? 'w-full' : 'md:col-span-12 col-span-12')}>
                {field.label && (
                  <label htmlFor={field.name} className="block text-xs text-[var(--light-grey-color)]">
                    {field.label}
                    {field.required && <span className="text-red-400 ml-1">*</span>}
                  </label>
                )}
                <BAZInput
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={stripHtml(watch('template') || '')}
                  onClick={field.onClick}
                  readOnly={true}
                  placeholder={field.placeholder || 'Click to add template content'}
                  disabled={field.disabled}
                  error={fieldError}
                  className="outline-none w-full"
                />
              </div>
            );
          }

          return (
            <div key={field.name} className={field.className || (isAuth ? 'w-full' : 'md:col-span-6 col-span-12')}>
              <FormField
                field={field}
                value={getValues(field.name)}
                onChange={onFieldChange[field.name] || ((e) => setValue(field.name, e.target.value, { shouldValidate: true }))}
                onClick={field.onClick}
                readOnly={field.readOnly}
                error={fieldError}
                togglePassword={field.type === 'password' ? extraProps.togglePassword : undefined}
                showPassword={field.type === 'password' ? extraProps.showPassword : undefined}
                isAuth={isAuth}
                existingFiles={existingFiles[field.name]}
              />
              {field.type === 'file' && existingFileName && (
                <div className="mt-2 text-xs text-[var(--light-grey-color)]">
                  <span>Previously uploaded:</span> <span>{existingFileName}</span>
                </div>
              )}
            </div>
          );
        })}

        {isDynamic && dynamicFieldConfig.length > 0 && (
          <div className="md:col-span-12 col-span-12">
            <h4 className="text-sm font-semibold text-white mb-4">Dynamic Fields</h4>
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
                        onChange={(e) => setValue(`${dynamicFieldName}.${index}.${dField.name}`, e.target.value, { shouldValidate: true })}
                        error={getNestedError(errors, `${dynamicFieldName}.${index}.${dField.name}`)}
                      />
                    ))}
                  </div>
                  <Button type="button" onClick={() => remove(index)} className="text-red-400 hover:text-red-300 p-2" disabled={dynamicFields.length === 1}>
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
      {/* Popup Jodit Editor Modal */}
      {isJodit && (
        <BAZModal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} title="Edit Template" size="xl">
          <div className="p-4 space-y-4">
            <BAZJodiEdit
              placeholder="Enter template"
              value={watch('template') || ''}
              onChange={(val: string) => setValue('template', val, { shouldValidate: true, shouldDirty: true })}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" className="px-4 py-2 bg-gray-600 text-white rounded" onClick={() => setIsEditorOpen(false)}>
                Cancel
              </Button>
              <Button type="button" className="px-4 py-2 bg-[var(--puprle-color)] text-white rounded" onClick={() => setIsEditorOpen(false)}>
                Save
              </Button>
            </div>
          </div>
        </BAZModal>
      )}
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