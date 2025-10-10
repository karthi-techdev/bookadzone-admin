import { useMemo, useCallback } from 'react';
import { useFormField } from './useFormField';
import type { FieldConfig } from '../types/common';

export const useMemoizedField = (
  fieldName: string,
  config: FieldConfig,
  onChange?: (e: { target: { name: string; value: any; removedFiles?: string[] } }) => void,
  dependencies: any[] = []
) => {
  const { handleFieldChange } = useFormField();

  // Memoize the onChange handler
  const memoizedOnChange = useCallback(
    handleFieldChange(fieldName, config, onChange),
    // Include fieldName and onChange in dependencies to recreate if they change
    [fieldName, onChange, ...dependencies]
  );

  // Memoize the field configuration
  const memoizedConfig = useMemo(
    () => ({
      ...config,
      name: fieldName
    }),
    [fieldName, config]
  );

  return {
    fieldConfig: memoizedConfig,
    onChange: memoizedOnChange
  };
};