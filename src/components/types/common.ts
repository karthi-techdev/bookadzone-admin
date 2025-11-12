export interface Agency {
  _id?: string;
  userId?: string;
  agencyName: string;
  agencyLogo: string | File;
  name: string;
  photo: string | File;
  position: string;
  yourEmail: string;
  yourPhone: string;
  companyEmail: string;
  companyPhone: string;
  companyRegistrationNumberGST: string;
  website: string;
  uploadIdProof: string | File;
  uploadBusinessProof: string | File;
  agencyAddress: string;
  agencyLocation: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  password?: string;
  status?: boolean;
  priority?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AgencyInput extends Omit<Agency, '_id' | 'userId' | 'status' | 'priority' | 'createdAt' | 'updatedAt'> {
  password: string; // Make password required for new agencies
}
export interface BannerOne {
  title: string;
  highlightedText: string;
  image1: string;
  subHead1: string;
  subDescription1: string;
  image2: string;
  subHead2: string;
  subDescription2: string;
  image3: string;
  subHead3: string;
  subDescription3: string;
}

export interface BannerTwo {
  backgroundImage: string;
  title: string;
  description: string;
  features?: Array<{ icon?: string; title?: string }>;
  buttonName: string;
  buttonUrl: string;
}




export interface Banner {
  homepage: {
    bannerOne: BannerOne;
    bannerTwo: BannerTwo;
  };
  aboutBanner: {
    submenu1: {
      backgroundImage: string;
      title: string;
      description: string;
      images: string[];
    };
    submenu2: {
      backgroundImage: string;
      title: string;
      description: string;
      images: string[];
    };
  };
}

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
  userType?: string;
  phone?: string;
  password?: string;
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

export interface Category {
  length: number;
  _id?: string;
  name: string;
  slug: string,
  description: string;
  photo?: string | File;
  isFeatured: boolean | undefined;
  status?: boolean;
  CategoryFields: { key: string; value: string }[];
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
  | 'array'
  | 'dynamic'
  | 'tel'
  | 'url';

export type FieldValue = string | number | boolean | File | File[] | null | undefined;

export interface FormFieldChangeEvent<T = FieldValue> {
  target: {
    name: string;
    value: T;
    removedFiles?: string[];
  };
}

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
  defaultValue?: FieldValue;
  valueAsNumber?: boolean;
  onChange?: (e: FormFieldChangeEvent) => void;
  dataTestId?: string;
  value?: any;
  tableConfig?: TableConfig;

  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  onClick?: () => void;
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
export interface BlogCategory {
  _id?: string
  name: string;
  label: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
  status?: boolean;
  slug: string;

}
export interface NewsLetter {
  _id?: string;
  name: string;
  slug: string;
  template: string;
  status?: boolean;
}

export interface Page {
  _id?: string;
  title: string;
  name: string;
  slug: string;
  type: 'link' | 'template';
  url?: string;
  description?: string;
  status: 'active' | 'inactive';
}

export interface Country {
  name: string;
  iso2: string;
}
export interface State {
  name: string;
  country_code: string;
  iso2: string;
}
export interface City {
  name: string;
  country_code: string;
  state_code: string;
}
