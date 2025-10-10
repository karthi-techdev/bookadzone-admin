import { useMemo } from 'react';
import type { FieldConfig } from '../types/common';

interface ValidationError {
  field: string;
  message: string;
}

export class FormValidator {
  public static validateField = (field: FieldConfig, value: any): ValidationError | null => {
    return this.performValidation(field, value);
  };

  private static performValidation(field: FieldConfig, value: any): ValidationError | null {
    // Implement your validation logic here
    if (field.required && !value) {
      return {
        field: field.name,
        message: `${field.name} is required`
      };
    }

    // Add more validation rules as needed
    return null;
  }
}

// React hook for memoized field validation
export const useValidation = (field: FieldConfig, value: any) => {
  return useMemo(
    () => FormValidator.validateField(field, value),
    [field, value]
  );
};