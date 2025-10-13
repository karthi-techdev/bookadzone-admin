import type { FieldConfig } from '../../types/common';

export const loginFields: FieldConfig[] = [
  {
    name: 'username',
    label: 'Email',
    type: 'email',
    required: true,
    className: 'md:col-span-6 ',
    placeholder: 'Enter Your Email',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    required: true,
    className: 'md:col-span-6',
    placeholder: 'Enter Your Password',
  },
];
