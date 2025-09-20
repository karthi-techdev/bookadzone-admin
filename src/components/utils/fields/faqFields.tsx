
import type { FieldConfig } from '../../types/common';

export const faqFields: FieldConfig[] = [
  {
    name: 'question',
    label: 'Question',
    type: 'textarea',
    required: true,
    className: 'md:col-span-6',
    placeholder: 'Enter your question...',
  },
  {
    name: 'answer',
    label: 'Answer',
    type: 'textarea',
    required: true,
    className: 'md:col-span-6',
    placeholder: 'Enter the answer...',
  },
];