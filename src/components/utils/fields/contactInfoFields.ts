import type { FieldConfig } from '../../types/common';

export const contactInfoFields: FieldConfig[] = [
  { name: 'companyName', label: 'Company Name', type: 'text', required: true },
  { name: 'contactEmail', label: 'Contact Email', type: 'email', required: true },
  { name: 'contactPhone', label: 'Contact Phone', type: 'text', required: false },
  { name: 'address', label: 'Address', type: 'text', required: false },
];