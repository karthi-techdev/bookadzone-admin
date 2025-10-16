import type { FieldConfig } from '../../types/common';

export const pageFields: FieldConfig[] = [
  {
    name: 'title',
    label: 'Title',
    type: 'select',
    required: true,
    className: 'md:col-span-6',
    placeholder: 'Select title from config...',
    options: [], // To be populated from config
  },
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
    readOnly: true,
  },
  {
    name: 'type',
    label: 'Type',
    type: 'select',
    required: true,
    className: 'md:col-span-6',
    options: [
      { value: 'link', label: 'Link' },
      { value: 'template', label: 'Template' },
    ],
  },
  {
    name: 'url',
    label: 'URL',
    type: 'text',
    required: false,
    className: 'md:col-span-6',
    placeholder: 'Enter the URL...',
    // showIf will be handled in template
  },
  {
    name: 'template',
    label: 'Template Description',
    type: 'textarea',
    required: false,
    className: 'md:col-span-6',
    placeholder: 'Enter the description for template...',
    // showIf will be handled in template
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    required: true,
    className: 'md:col-span-6',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ],
  },
];
