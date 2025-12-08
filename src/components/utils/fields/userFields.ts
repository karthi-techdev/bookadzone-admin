
import type { FieldConfig } from '../../types/common';

export const userFields: FieldConfig[] = [
  {
    name: 'username',
    label: 'Username',
    type: 'text',
    placeholder: 'Enter username',
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter email address',
  },
  {
    name: 'role',
    label: 'Role',
    type: 'select',
    options: [],
  },
  {
    name: 'userType',
    label: 'User Type',
    type: 'select',
    options: [
      { value: 'admin', label: 'Admin' },
      { value: 'agency', label: 'Agency' },
      { value: 'subadmin', label: 'Subadmin' },
      { value: 'advertiser', label: 'Advertiser' },
      { value: 'others', label: 'Others' },
    ],
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'tel',
    placeholder: 'Enter phone number',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
  },
];
