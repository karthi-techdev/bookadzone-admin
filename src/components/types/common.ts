export interface Agency {
  _id?: string;
  agencyName: string;
  agencyLogo?: string | File;
  name: string;
  photo?: string | File;
  position?: string;
  yourEmail: string;
  yourPhone: string;
  companyEmail?: string;
  companyPhone?: string;
  companyRegistrationNumberGST?: string;
  website?: string;
  uploadIdProof?: string | File;
  uploadBusinessProof?: string | File;
  agencyAddress?: string;
  agencyLocation?: string;
  state?: string;
  city?: string;
  pincode?: string;
  password: string;
  status?: boolean;
  priority?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AgencyInput {
  agencyName: string;
  agencyLogo?: string | File;
  name: string;
  photo?: string | File;
  position?: string;
  yourEmail: string;
  yourPhone: string;
  companyEmail?: string;
  companyPhone?: string;
  companyRegistrationNumberGST?: string;
  website?: string;
  uploadIdProof?: string | File;
  uploadBusinessProof?: string | File;
  agencyAddress?: string;
  agencyLocation?: string;
  state?: string;
  city?: string;
  pincode?: string;
  password: string;
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
  photo: string | File;
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
  | 'dynamic';

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
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  onClick?: () => void;
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
export interface NewsLetter {
  _id?: string;
  name: string;
  slug: string ;
  template:string;
  status?: boolean;
}

