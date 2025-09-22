import type { FieldConfig } from '../../types/common';

export const emailConfigFields: FieldConfig[] = [
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'mailHost', label: 'Mail Host', type: 'text', required: true },
  { name: 'smtpUsername', label: 'SMTP Username', type: 'text', required: true },
  { name: 'smtpPassword', label: 'SMTP Password', type: 'password', required: true },
  { name: 'mailPort', label: 'Mail Port', type: 'number', required: true },
  { name: 'emailEncryption', label: 'Email Encryption', type: 'text', required: false },
];