import type { FieldConfig } from '../../types/common';

export const configFields: FieldConfig[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    placeholder: 'Enter config name',
  },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text',
    required: true,
    placeholder: 'Enter config slug',
  },
];

// Dynamic fields config for configFields
export const configFieldsDynamic: FieldConfig[] = [
  { name: 'key', label: 'Key', type: 'text', required: true, placeholder: 'Enter key' },
  { name: 'value', label: 'Value', type: 'text', required: true, placeholder: 'Enter value' },
];