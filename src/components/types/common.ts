export interface Settings {
  general: {
    siteName: string;
    siteLogo: string;
    favicon: string;
    defaultCurrency: string;
    currencyIcon: string;
    timezone: string;
  };
  contact: {
    companyName: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
  };
  email: {
    email: string;
    mailHost: string;
    smtpUsername: string;
    smtpPassword: string;
    mailPort: number;
    emailEncryption: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeyword: string;
    canonicalUrl: string;
    robotsMeta: string;
    schemaMarkup: string;
    h1Tag: string;
    breadcrumbs: string;
    altText: string;
    sitemapUrl: string;
    googleAnalyticsCode: string;
    googleSearchConsoleCode: string;
  };
  og: {
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    ogUrl: string;
    ogType: string;
  };
}

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

export interface Config {
  _id?: string;
  name: string;
  slug: string;
  configFields?: { key: string; value: string }[];
  status?: boolean;
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

export interface BlogCategory {
  _id?:string
  name:string;
  label:string;
  className?: string;
  placeholder?: string;
  required?: boolean;
  status?:boolean;
  slug: string;

}