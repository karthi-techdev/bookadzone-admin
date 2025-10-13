import type { FieldConfig } from '../../types/common';

export const profileUpdateFields: FieldConfig[] = [
  {
    name: 'email',
    label: 'Email Address',
    type: 'email',
    required: true,
    placeholder: 'Enter your email',
    className: 'md:col-span-12'
  },
   {
    name: 'name',
    label: 'Name',
    type: 'text',
    required: true,
    placeholder: 'Enter your name',
    className: 'md:col-span-12'
  }
];

export const changePasswordFields: FieldConfig[] = [
  {
    name: 'oldPassword',
    label: 'Current Password',
    type: 'password',
    required: true,
    placeholder: 'Enter current password',
    className: 'md:col-span-12'
  },
  {
    name: 'newPassword',
    label: 'New Password',
    type: 'password',
    required: true,
    placeholder: 'Enter new password',
    className: 'md:col-span-12'
  },
  {
    name: 'confirmPassword',
    label: 'Confirm New Password',
    type: 'password',
    required: true,
    placeholder: 'Confirm new password',
    className: 'md:col-span-12'
  }
];