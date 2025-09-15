
export interface User {
  _id?: string;
  username: string;
  email?: string;
  role?: string;
}


export interface Faq {
  _id?: string;
  question: string;
  answer: string;
  status?: boolean;
  priority: number;
}

export type InputType =
  | 'text'
  | 'email'
  | 'number'
  | 'date'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'file'
  | 'radio'
  | 'password'
  | 'country-select'
  | 'state-select'
  | 'city-select'
  | 'composite'
  | 'password'
  | 'array';

export interface FieldConfig {
  name: string;
  label: string;
  type: InputType;
  required?: boolean;
  className?: string;
  placeholder?: string;
  ariaLabel?: string;
  options?: { value: string; label: string }[];
  multiple?: boolean;
  accept?: string;
  fileId?: string;
  arrayFields?: FieldConfig[];
  addButtonText?: string;
  fields?: FieldConfig[];
  disabled?: boolean;
  readonly?: boolean;
  showIf?: () => boolean;
  readOnly?: boolean;
  defaultValue?: any;
  valueAsNumber?: boolean;
  onChange?: (e: React.ChangeEvent<any> | { target: { name: string; value: any } }) => void;
  dataTestId?: string;
  value?:any;
}


export interface FieldGroup {
  label: string;
  fields: FieldConfig[];
}

export type ColumnConfig<T> = {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  showIf?: () => boolean;
};

export interface SelectOption {
  label: string;
  value: string | number;
}
