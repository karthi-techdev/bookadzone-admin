import type { FieldConfig } from "../../types/common";
export const blogCategoryFields: FieldConfig[] = [
  
    {
        name: 'name',
        label: 'Name',
        type: 'text',
        required: true,
        className: 'md:col-span-6',
        placeholder: 'Enter your name...',
    },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text',
    required: true,
    placeholder: 'Enter config slug',
  },
]


