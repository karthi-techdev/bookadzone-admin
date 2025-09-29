import type { FieldConfig } from '../../types/common';

export const generalSettingsFields: FieldConfig[] = [
  { name: 'siteName', label: 'Site Name', type: 'text', required: true },
  { name: 'siteLogo', label: 'Site Logo', type: 'file', required: true, accept: 'image/*' },
  { name: 'favicon', label: 'Favicon', type: 'file', required: true, accept: 'image/*' },
  { name: 'defaultCurrency', label: 'Default Currency', type: 'text', required: true },
  { name: 'currencyIcon', label: 'Currency Icon', type: 'text', required: true },
  { name: 'timezone', label: 'Timezone', type: 'text', required: true },
];