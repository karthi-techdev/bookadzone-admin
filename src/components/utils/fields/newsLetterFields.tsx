
import type { FieldConfig } from '../../types/common';

export const newsLetterFields: FieldConfig[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    className: 'md:col-span-6',
    placeholder: 'Enter your name...',
  },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text',
    required: true,
    className: 'md:col-span-6',
    placeholder: 'Enter the slug...',
  },
  {
    name: 'template',
    label: 'Template',
    type: 'text',
    required: true,
    className: 'md:col-span-6',
    placeholder: 'Enter the template...',
  },
];