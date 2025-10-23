import type { FieldConfig } from '../../types/common';

export const BlogFields: FieldConfig[] = [

  {
    name: 'seoTitle',
    label: 'SEO Title',
    type: 'text',
    required: true,
    className: 'md:col-span-6',
    placeholder: 'Enter your SEO Title...',
  },
  {
    name: 'seoDescription',
    label: 'SEO Description',
    type: 'textarea',
    required: false,
    className: 'md:col-span-6',
    placeholder: 'Enter your SEO Description...',
    disabled: false,
  },
  {
    name: 'blogTitle',
    label: 'Blog ',
    type: 'text',
    required: true,
    className: 'md:col-span-6',
    placeholder: 'Enter the Blog Title...',
  },
  {
    name: 'template',
    label: 'Blog Description',
    type: 'text', // will open Jodit editor via ManagementForm when isJodit is true
    required: true,
    className: 'md:col-span-6',
    placeholder: 'Click to add/edit the Blog Description...',
  },
      {
    name: 'blogCategory',
    label: 'Blog Category',
    type: 'select',
    required: true,
    className: 'md:col-span-12',
    placeholder: 'Select Blog Category...',
    // Options are injected at runtime from the form using the store
  },
  {
    name: 'blogImg',
    label: 'Blog Image',
    type: 'file',
    required: true,
    className: 'md:col-span-12',
    placeholder: 'Select the Blog Image...',
    accept: 'image/*',
  },
];
