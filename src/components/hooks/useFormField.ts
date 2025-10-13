import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';
import type { FieldConfig } from '../types/common';

export const useFormField = () => {
  const { setValue, clearErrors, getValues } = useFormContext();

  const handleFieldChange = (
    fieldName: string,
    config: FieldConfig,
    onChange?: (e: { target: { name: string; value: any; removedFiles?: string[] } }) => void
  ) => (e: { target: { name: string; value: any; files?: FileList; checked?: boolean; removedFiles?: string[] } }) => {
    clearErrors(fieldName);

    let value: any;
    let removedFiles: string[] | undefined;

    // Handle different input types
    if (config.type === 'file') {
      if ('removedFiles' in e.target) {
        value = e.target.value;
        removedFiles = e.target.removedFiles;
      } else if (e.target.files) {
        value = config.multiple ? Array.from(e.target.files) : e.target.files[0];
      }
    } else if (config.type === 'checkbox') {
      value = e.target.checked;
    } else if (config.type === 'number' && config.valueAsNumber) {
      value = e.target.value === '' ? undefined : Number(e.target.value);
    } else {
      value = e.target.value;
    }

    // Set the value in the form
    setValue(fieldName, value, { shouldValidate: true });

    // Call the custom onChange handler if provided
    if (onChange) {
      onChange({
        target: {
          name: fieldName,
          value,
          ...(removedFiles && { removedFiles })
        }
      });
    }
  };

  const handleDynamicFieldAdd = (
    dynamicFieldName: string,
    config: FieldConfig[],
    toastMessage = 'Please fill out the previous field completely before adding a new one.'
  ) => {
    const fields = getValues(dynamicFieldName) || [];
    
    // Check if the last field is complete
    if (fields.length > 0) {
      const lastField = fields[fields.length - 1];
      const isComplete = config.every(fieldConfig => {
        if (fieldConfig.required) {
          const value = lastField[fieldConfig.name];
          return value && value.toString().trim() !== '';
        }
        return true;
      });

      if (!isComplete) {
        toast.error(toastMessage);
        return false;
      }
    }

    // Create empty field
    const emptyField = config.reduce((acc, fieldConfig) => ({
      ...acc,
      [fieldConfig.name]: ''
    }), {});

    setValue(`${dynamicFieldName}.${fields.length}`, emptyField);
    return true;
  };

  return {
    handleFieldChange,
    handleDynamicFieldAdd
  };
};