import type { FieldConfig } from '../../types/common';

export const ogConfigFields: FieldConfig[] = [
  { name: 'ogTitle', label: 'OG Title', type: 'text' ,required: true},
  { name: 'ogDescription', label: 'OG Description', type: 'text' ,required: true},
  { name: 'ogImage', label: 'OG Image', type: 'file', required: true, accept: 'image/*' },
  { name: 'ogUrl', label: 'OG URL', type: 'text', required: true },
  { name: 'ogType', label: 'OG Type', type: 'text', required: true },
];