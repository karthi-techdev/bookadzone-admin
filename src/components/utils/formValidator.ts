import type { FieldConfig } from '../types/common';

export interface ValidationError {
  field: string;
  message: string;
}

export class FormValidator {
  private static isRequired(value: any, fieldName: string): ValidationError | null {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return {
        field: fieldName,
        message: `${fieldName} is required`
      };
    }
    return null;
  }

  private static minLength(value: string, fieldName: string, length: number): ValidationError | null {
    if (value.length < length) {
      return {
        field: fieldName,
        message: `${fieldName} must be at least ${length} characters`
      };
    }
    return null;
  }

  private static isEmail(value: string, fieldName: string): ValidationError | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return {
        field: fieldName,
        message: `Please enter a valid email address`
      };
    }
    return null;
  }

  private static isPhone(value: string, fieldName: string): ValidationError | null {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(value)) {
      return {
        field: fieldName,
        message: `Please enter a valid ${fieldName}`
      };
    }
    return null;
  }

  private static isPassword(value: string, fieldName: string): ValidationError | null {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(value)) {
      return {
        field: fieldName,
        message: 'Password must contain at least 8 characters, including uppercase, lowercase, number and special character'
      };
    }
    return null;
  }

  private static isUrl(value: string, fieldName: string): ValidationError | null {
    try {
      new URL(value);
      return null;
    } catch {
      return {
        field: fieldName,
        message: `Please enter a valid URL`
      };
    }
  }

  private static isValidFileType(file: File, fieldName: string, acceptedTypes: string): ValidationError | null {
    const types = acceptedTypes.split(',').map(type => type.trim());
    const fileType = file.type;
    const fileExtension = `.${file.name.split('.').pop()}`;

    if (!types.some(type => {
      if (type.startsWith('.')) {
        return fileExtension.toLowerCase() === type.toLowerCase();
      }
      if (type.endsWith('/*')) {
        return fileType.startsWith(type.replace('/*', ''));
      }
      return fileType === type;
    })) {
      return {
        field: fieldName,
        message: `Invalid file type. Accepted types: ${acceptedTypes}`
      };
    }
    return null;
  }

  public static validateField(field: FieldConfig, value: any): ValidationError | null {
    if (field.required) {
      const requiredError = this.isRequired(value, field.name);
      if (requiredError) return requiredError;
    }

    if (value) {
      if (field.type === 'email') {
        const emailError = this.isEmail(value, field.name);
        if (emailError) return emailError;
      }

      if (field.type === 'tel') {
        const phoneError = this.isPhone(value, field.name);
        if (phoneError) return phoneError;
      }

      if (field.type === 'password') {
        const passwordError = this.isPassword(value, field.name);
        if (passwordError) return passwordError;
      }

      if (field.type === 'url') {
        const urlError = this.isUrl(value, field.name);
        if (urlError) return urlError;
      }

      if (field.type === 'file' && value instanceof File && field.accept) {
        const fileError = this.isValidFileType(value, field.name, field.accept);
        if (fileError) return fileError;
      }

      if (field.minLength && typeof value === 'string') {
        const minLengthError = this.minLength(value, field.name, field.minLength);
        if (minLengthError) return minLengthError;
      }
    }

    return null;
  }

  public static validateForm(fields: FieldConfig[], values: Record<string, any>): ValidationError[] {
    const errors: ValidationError[] = [];

    fields.forEach(field => {
      const error = this.validateField(field, values[field.name]);
      if (error) {
        errors.push(error);
      }
    });

    return errors;
  }
}