// src/utils/fields/emailConfigFields.ts
// Standard email configuration fields for the EmailConfigTemplate form
export const emailConfigFields = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    required: true,
  },
  {
    name: 'mailHost',
    label: 'Mail Host',
    type: 'text',
    required: true,
  },
  {
    name: 'smtpUsername',
    label: 'SMTP Username',
    type: 'text',
    required: true,
  },
  {
    name: 'smtpPassword',
    label: 'SMTP Password',
    type: 'password',
    required: true,
  },
  {
    name: 'mailPort',
    label: 'Mail Port',
    type: 'text',
    required: true,
  },
  {
    name: 'emailEncryption',
    label: 'Email Encryption',
    type: 'text',
    required: true,
    options: [
      { label: 'None', value: 'None' },
      { label: 'SSL', value: 'SSL' },
      { label: 'TLS', value: 'TLS' },
    ],
  },
];
