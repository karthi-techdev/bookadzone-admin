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

interface TabConfig {
  id: number;
  label: string;
  fields: FieldConfig[];
  isDynamic?: boolean;
  dynamicFieldName?: string;
  dynamicFieldConfig?: FieldConfig[];
}

interface ManagementFormProps {
  label: string;
  fields?: FieldConfig[];
  isSubmitting?: boolean;
  isJodit?: boolean;
  managementName?: string;
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
  tabs?: TabConfig[];
  initialTab?: number;
  onFieldChange?: { [key: string]: (e: { target: { name: string; value: any } }) => void };
  toastErrorMessage?: string;
  extraProps?: { togglePassword?: () => void; showPassword?: boolean };
  onTabChange?: (tabId: number) => void;
  activeTab?: number;
}

const ManagementForm: React.FC<ManagementFormProps> = ({
  label,
  fields = [],
  isSubmitting,
  onSubmit,
  onButtonClick,
  existingFileName,
  existingFiles = {},
  isAuth = false,
  isDynamic = false,
  isJodit = false,
  managementName,
  dynamicFieldName = 'dynamicFields',
  dynamicFieldConfig = [],
  tabs,
  initialTab = 1,
  ['data-testid']: dataTestId,
  onFieldChange = {},
  toastErrorMessage = 'Please fill out the previous field completely before adding a new one.',
  extraProps = {},
  onTabChange,
  activeTab: propActiveTab,
}) => {
  const { control, formState: { errors }, getValues, setValue, register, watch } = useFormContext();
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [activeTab, setActiveTab] = useState(propActiveTab || initialTab);
  
  // Use the active tab from props if provided, otherwise use local state
  const currentActiveTab = propActiveTab !== undefined ? propActiveTab : activeTab;
  
  // For dynamic fields, use the config from the active tab if tabs are present
  const tabConfig = tabs ? tabs.find(tab => tab.id === currentActiveTab) : undefined;
  const dynamicFieldNameToUse = tabConfig?.dynamicFieldName || dynamicFieldName;
  const dynamicFieldConfigToUse = tabConfig?.dynamicFieldConfig || dynamicFieldConfig;
  const isDynamicToUse = tabConfig?.isDynamic ?? isDynamic;
  
  const { fields: dynamicFields, append, remove } = useFieldArray({
    control,
    name: dynamicFieldNameToUse,
  });

  // Watch the dynamic fields for changes
  const watchedDynamicFields = watch(dynamicFieldNameToUse);

  // Update local activeTab when propActiveTab changes
  useEffect(() => {
    if (propActiveTab !== undefined) {
      setActiveTab(propActiveTab);
    }
  }, [propActiveTab]);

  // Initialize dynamic fields only when needed and avoid duplication
  useEffect(() => {
    if (isDynamicToUse) {
      const existingValues = getValues(dynamicFieldNameToUse);
      
      // If we have no dynamic fields registered but we have existing values, we need to register them
      if (dynamicFields.length === 0 && existingValues && Array.isArray(existingValues) && existingValues.length > 0) {
        // Append existing values to the field array
        existingValues.forEach(value => {
          append(value);
        });
      } else if (dynamicFields.length === 0 && (!existingValues || existingValues.length === 0)) {
        // Add one empty field if no existing values
        const emptyField: Record<string, string> = {};
        dynamicFieldConfigToUse.forEach(config => {
          emptyField[config.name] = '';
        });
        append(emptyField);
      }
    }
  }, [isDynamicToUse, dynamicFields.length, dynamicFieldConfigToUse, append, getValues, dynamicFieldNameToUse, watchedDynamicFields]);

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
    if (!isDynamicToUse || dynamicFields.length === 0) return true;
    
    const lastIndex = dynamicFields.length - 1;
    const lastFieldValues = getValues(`${dynamicFieldNameToUse}[${lastIndex}]`) || {};
    
    // Check if all required fields in the last entry are filled
    return dynamicFieldConfigToUse.every(config => {
      const value = lastFieldValues[config.name];
      if (config.required !== false) { // Default to required if not specified
        return value && value.toString().trim() !== '';
      }
      return true;
    });
  };

  const handleAddField = () => {
    if (!canAddNewField()) {
      toast.error(toastErrorMessage, { position: 'top-right', autoClose: 3000 });
      return;
    }
    
    const emptyField: Record<string, string> = {};
    dynamicFieldConfigToUse.forEach(config => {
      emptyField[config.name] = '';
    });
    append(emptyField);
  };

  const handleRemoveField = (index: number) => {
    // Prevent removing if it's the only field and it's empty
    if (dynamicFields.length === 1) {
      const fieldValues = getValues(`${dynamicFieldNameToUse}[${index}]`) || {};
      const hasValues = dynamicFieldConfigToUse.some(config => {
        const value = fieldValues[config.name];
        return value && value.toString().trim() !== '';
      });
      
      if (!hasValues) {
        toast.error('At least one field is required', {
          position: 'top-right',
          autoClose: 3000,
        });
        return;
      }
    }
    
    remove(index);
  };

  const handleTabClick = (tabId: number) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  const handleDynamicFieldChange = (index: number, fieldName: string) => (e: { target: { name: string; value: any } }) => {
    const fieldPath = `${dynamicFieldNameToUse}.${index}.${fieldName}`;
    setValue(fieldPath, e.target.value, { shouldValidate: true });
  };

  // Ensure 'template' is registered when Jodit editor is used
  useEffect(() => {
    if (isJodit) {
      register('template');
    }
  }, [isJodit, register]);

  // AUTH FORM RENDER
  if (isAuth) {
    return (
      <motion.form
        onSubmit={handleButtonClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col justify-center items-center w-full"
        data-testid={dataTestId || 'auth-form'}
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
                togglePassword={field.type === 'password' ? extraProps.togglePassword : undefined}
                showPassword={field.type === 'password' ? extraProps.showPassword : undefined}
                isAuth={isAuth}
                existingFiles={existingFiles[field.name]}
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

  // MAIN FORM RENDER (NON-AUTH)
  return (
    <div>
      {/* Tabs */}
      {tabs && tabs.length > 0 && (
        <div className="mb-4 flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-colors duration-200 ${
                currentActiveTab === tab.id 
                  ? 'bg-[var(--light-purple-color)] text-[var(--white-color)] border-purple-300' 
                  : 'bg-[var(--light-purple-color)] text-[var(--white-color)] border-transparent'
              }`}
              onClick={() => handleTabClick(tab.id)}
              style={{ boxShadow: currentActiveTab === tab.id ? '0 2px 4px rgba(0,0,0,0.1)' : undefined }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Jodit Editor Modal */}
      {isJodit && (
        <BAZModal isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} title="Edit Template" size="xl">
          <div className="p-4 space-y-4">
            <BAZJodiEdit
              placeholder="Enter template"
              value={watch('template') || ''}
              onChange={(val: string) => setValue('template', val, { shouldValidate: true, shouldDirty: true })}
              managementName={managementName}
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

      {/* Main Form */}
      <motion.form
        onSubmit={handleButtonClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[var(--light-dark-color)] border border-[var(--light-blur-grey-color)] rounded-xl shadow-sm p-6"
        data-testid={dataTestId || 'management-form'}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Regular Fields */}
          {(tabs ? tabConfig?.fields : fields)?.map((field) => {
            const fieldError = getNestedError(errors, field.name);
            const isTemplateEditor = isJodit && field.name === 'template';
            const isTemplatePreview = !isJodit && field.name === 'template' && field.readOnly;

            if (isTemplateEditor) {
              return (
                <div key={field.name} className={field.className || 'md:col-span-12 col-span-12'}>
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
                <div key={field.name} className={field.className || 'md:col-span-12 col-span-12'}>
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
              <div key={field.name} className={field.className || 'md:col-span-6 col-span-12'}>
                <FormField
                  field={field}
                  value={getValues(field.name)}
                  onChange={onFieldChange[field.name] || ((e) => {
                    setValue(field.name, e.target.value, { shouldValidate: true });
                  })}
                  onClick={field.onClick}
                  readOnly={field.readOnly}
                  error={fieldError}
                  togglePassword={field.type === 'password' ? extraProps.togglePassword : undefined}
                  showPassword={field.type === 'password' ? extraProps.showPassword : undefined}
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

          {/* Dynamic Fields Section */}
          {isDynamicToUse && dynamicFieldConfigToUse.length > 0 && (
            <div className="md:col-span-12 col-span-12">
              <h4 className="text-sm font-semibold text-white mb-4">
                {dynamicFieldNameToUse === 'features' ? 'Features' : 'Dynamic Fields'}
              </h4>
              <div className="space-y-4">
                {dynamicFields.map((dynamicField, index) => (
                  <div
                    key={dynamicField.id}
                    className="bg-[var(--dark-color)] border border-[var(--light-blur-grey-color)] rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center"
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      {dynamicFieldConfigToUse.map((dField) => {
                        const fieldPath = `${dynamicFieldNameToUse}.${index}.${dField.name}`;
                        return (
                          <FormField
                            key={fieldPath}
                            field={{ ...dField, name: fieldPath }}
                            value={getValues(fieldPath)}
                            onChange={handleDynamicFieldChange(index, dField.name)}
                            error={getNestedError(errors, fieldPath)}
                          />
                        );
                      })}
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleRemoveField(index)}
                      className="text-red-400 hover:text-red-300 p-2"
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
                disabled={!canAddNewField()}
              >
                <FiPlus className="mr-1" />
                Add {dynamicFieldNameToUse === 'features' ? 'Feature' : 'Field'}
              </Button>
            </div>
          )}
        </div>

        {/* Submit Button */}
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
    </div>
  );
};

export default React.memo(ManagementForm);