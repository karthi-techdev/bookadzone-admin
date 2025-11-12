// src/utils/fields/userFields.ts
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
    type: 'text',
    placeholder: 'Enter user type',
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
