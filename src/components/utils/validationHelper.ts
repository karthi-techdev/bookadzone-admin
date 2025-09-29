
interface ValidationError {
  field: string;
  message: string;
}

export class ValidationHelper {
  static capitalize(field: string): string {
    if (!field) return field;
    return field.charAt(0).toUpperCase() + field.slice(1);
  }

  static isValidFileType(value: any, field: string, accept: string): ValidationError | null {
    if (!value) return null;
    const allowedTypes = accept.split(',').map(type => type.trim());
    if (value instanceof File) {
      const fileType = value.type;
      const fileName = value.name;
      if (allowedTypes.some(type => type === fileType || (type.endsWith('/*') && fileType.startsWith(type.slice(0, -1))))) {
        return null;
      }
      if (allowedTypes.some(type => type.startsWith('.') && fileName.endsWith(type))) {
        return null;
      }
      const capField = ValidationHelper.capitalize(field);
      return { field, message: `${capField} must be of type: ${accept}` };
    }
    return null;
  }
  static isRequired(value: any, field: string): ValidationError | null {
    if (value === null || value === undefined || (typeof value === "string" && value.trim() === "")) {
      const capField = ValidationHelper.capitalize(field);
      return { field, message: `${capField} is required` };
    }
    return null;
  }

  static minLength(value: string, field: string, min: number): ValidationError | null {
    if (typeof value !== "string" || value.trim().length < min) {
      const capField = ValidationHelper.capitalize(field);
      return { field, message: `${capField} must be at least ${min} characters long` };
    }
    return null;
  }

  static maxLength(value: string, field: string, max: number): ValidationError | null {
    if (typeof value !== "string" || value.trim().length > max) {
      const capField = ValidationHelper.capitalize(field);
      return { field, message: `${capField} must not exceed ${max} characters` };
    }
    return null;
  }

  static isValidEmail(value: any, field: string): ValidationError | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof value !== "string" || !emailRegex.test(value)) {
      const capField = ValidationHelper.capitalize(field);
      return { field, message: `${capField} must be a valid email address` };
    }
    return null;
  }

  static isValidPassword(value: any, field: string): ValidationError | null {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (typeof value !== "string" || !passwordRegex.test(value)) {
      const capField = ValidationHelper.capitalize(field);
      return {
        field,
        message: `${capField} must be at least 8 characters long and include at least one letter, one number, and one special character`
      };
    }
    return null;
  }

  static isValidEnum(value: any, field: string, allowedValues: string[]): ValidationError | null {
    if (value !== undefined && !allowedValues.includes(value)) {
      const capField = ValidationHelper.capitalize(field);
      return { field, message: `${capField} must be one of: ${allowedValues.join(", ")}` };
    }
    return null;
  }

  static maxValue(value: any, field: string, max: number): ValidationError | null {
    if (typeof value !== "number" || isNaN(value) || value > max) {
      const capField = ValidationHelper.capitalize(field);
      return { field, message: `${capField} must not exceed ${max}` };
    }
    return null;
  }

  static validate(rules: (ValidationError | null)[]): ValidationError[] {
    return rules.filter((error): error is ValidationError => error !== null);
  }
}

export default ValidationHelper;