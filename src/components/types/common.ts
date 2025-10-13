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
export interface FooterInfo {
  _id?: string;
  logo: string | File;
  description: string;
  socialmedia: string;
  socialmedialinks: string;
  google: string;
  appstore: string;
  status?: boolean;
  priority: number;
};

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
  tableConfig?: TableConfig;
  
}

export interface TableConfig {
  headers: string[];
  rows: Array<{
    key: string;
    values: Array<
      | string
      | {
          type: 'checkbox';
          name: string;
          checked: boolean;
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        }
    >;
  }>;
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

export interface IRole {
  _id: string;
  name: string; // e.g., 'admin', 'subadmin'
  status: 'active' | 'inactive';
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
  rolePrivileges?: { menuGroupId: string; status: boolean }[];
}

export interface IMenu {
  _id: string;
  name: string; 
  path: string;
  status: 'active' | 'inactive';
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IMenuPermission {
  _id: string;
  menuId: string | IMenu;
  roleId: string | IRole; 
  permissions: string[]; 
  status: 'active' | 'inactive';
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUserRole {
  _id?: string;
  roles: string[] | IRole[];
  menuPermissions: string[] | IMenuPermission[];
  menus: string[] | IMenu[];
  status: 'active' | 'inactive';
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}