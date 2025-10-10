import type { FieldConfig } from '../../types/common';

export const footerFields: FieldConfig[] = [
  {
    name: 'logo',
    label: 'Logo',
    type: 'file',
    required: true,
    className: 'md:col-span-12',
    accept: 'image/*'  
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    required: true,
    className: 'md:col-span-12',
    placeholder: 'Enter your description...',
  },
  {
    name: 'socialmedia',
    label: 'Social Media',
    type: 'text',
    required: false,
    className: 'md:col-span-6',
    placeholder: 'Enter social media handle...',
  },
  {
    name: 'socialmedialinks',
    label: 'Social Media Links',
    type: 'text',
    required: false,
    className: 'md:col-span-6',
    placeholder: 'Enter social media links...',
  },
  {
    name: 'google',
    label: 'Google',
    type: 'text',
    required: false,
    className: 'md:col-span-6',
    placeholder: 'Enter Google link...',
  },
  {
    name: 'appstore',
    label: 'App Store',
    type: 'text',
    required: false,
    className: 'md:col-span-6',
    placeholder: 'Enter App Store link...',
  },
  
];