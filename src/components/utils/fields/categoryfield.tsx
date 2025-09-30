import type { FieldConfig } from '../../types/common';

export const CategoryFields: FieldConfig[] = [
  {
    name: 'name',
    label: 'Category Name',
    type: 'text',
    required: true,
    className: 'md:col-span-6',
    placeholder: 'Enter your Category Name...',
  },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text',
    required: false,
    className: 'md:col-span-6',
    placeholder: ' Slug...',
    disabled: true,
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    required: true,
    className: 'md:col-span-12',
    placeholder: 'Enter the Description...',
  },
  {
    name: 'photo',
    label: 'Photo',
    type: 'file',
    required: true,
    className: 'md:col-span-12',
    placeholder: 'Enter the Photo...',
  },
  {
    name: 'isFeatured',
    label: 'Is Featured.',
    type: 'checkbox',
    required: false,
    className: 'md:col-span-12',
    placeholder: 'Pick the Checkbox...',
  }
];
