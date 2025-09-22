interface ValidationError {
  field: string;
  message: string;
}

export class ValidationHelper {
  static isRequired(value: any, field: string): ValidationError | null {
    if (value === null || value === undefined || (typeof value === "string" && value.trim() === "")) {
      return { field, message: `${field} is required` };
    }
    return null;
  }

  static minLength(value: string, field: string, min: number): ValidationError | null {
    if (typeof value !== "string" || value.trim().length < min) {
      return { field, message: `${field} must be at least ${min} characters long` };
    }
    return null;
  }

  static maxLength(value: string, field: string, max: number): ValidationError | null {
    if (typeof value !== "string" || value.trim().length > max) {
      return { field, message: `${field} must not exceed ${max} characters` };
    }
    return null;
  }

  static isValidEmail(value: any, field: string): ValidationError | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof value !== "string" || !emailRegex.test(value)) {
      return { field, message: `${field} must be a valid email address` };
    }
    return null;
  }

  static isValidPassword(value: any, field: string): ValidationError | null {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (typeof value !== "string" || !passwordRegex.test(value)) {
      return {
        field,
        message: `${field} must be at least 8 characters long and include at least one letter, one number, and one special character`
      };
    }
    return null;
  }

  static isValidEnum(value: any, field: string, allowedValues: string[]): ValidationError | null {
    if (value !== undefined && !allowedValues.includes(value)) {
      return { field, message: `${field} must be one of: ${allowedValues.join(", ")}` };
    }
    return null;
  }

  static maxValue(value: any, field: string, max: number): ValidationError | null {
    if (typeof value !== "number" || isNaN(value) || value > max) {
      return { field, message: `${field} must not exceed ${max}` };
    }
    return null;
  }

  static validate(rules: (ValidationError | null)[]): ValidationError[] {
    return rules.filter((error): error is ValidationError => error !== null);
  }
}

export default ValidationHelper;