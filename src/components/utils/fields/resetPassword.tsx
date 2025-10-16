import type { LloginFieldconfig } from '../../types/common';

export const ResetPassword: LloginFieldconfig[] = [
  {
    name: 'New Password',
    type: 'password',
    required: true,
    className: 'md:col-span-6 ',
    placeholder: 'New Password',
  },
  {
    name: 'Confirm Password',
    type: 'password',
    required: true,
    className: 'md:col-span-6',
    placeholder: 'Confirm Password',
  },
];


