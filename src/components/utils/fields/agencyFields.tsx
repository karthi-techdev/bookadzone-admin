import type { FieldConfig } from '../../types/common';

export const agencyFields: FieldConfig[] = [
  { name: 'agencyName', label: 'Agency Name', type: 'text', required: true, className: 'agencyName-col', placeholder: 'Enter agency name...' },
  { name: 'name', label: 'Contact Name', type: 'text', required: true, className: 'md:col-span-6', placeholder: 'Enter contact name...' },
  { name: 'position', label: 'Position', type: 'text', required: true, className: 'md:col-span-6', placeholder: 'Enter position...' },
  { name: 'yourEmail', label: 'Email', type: 'email', required: true, className: 'md:col-span-6', placeholder: 'Enter email...' },
  { name: 'yourPhone', label: 'Phone', type: 'text', required: true, className: 'md:col-span-6', placeholder: 'Enter phone number...' },
  { name: 'companyEmail', label: 'Company Email', type: 'email', required: true, className: 'md:col-span-6', placeholder: 'Enter company email...' },
  { name: 'companyPhone', label: 'Company Phone', type: 'text', required: true, className: 'md:col-span-6', placeholder: 'Enter company phone...' },
  { name: 'companyRegistrationNumberGST', label: 'Company GST/Reg. No.', type: 'text', required: true, className: 'md:col-span-6', placeholder: 'Enter GST/Registration number...' },
  { name: 'website', label: 'Website', type: 'text', required: true, className: 'md:col-span-6', placeholder: 'Enter website URL...' },
  { name: 'agencyAddress', label: 'Agency Address', type: 'textarea', required: true, className: 'md:col-span-6', placeholder: 'Enter agency address...' },
  { name: 'agencyLocation', label: 'Agency Location', type: 'text', required: true, className: 'md:col-span-6', placeholder: 'Enter location...' },
  { name: 'country', label: 'Country', type: 'select', required: true, className: 'md:col-span-6', placeholder: 'Select country...' },
  { name: 'state', label: 'State', type: 'select', required: true, className: 'md:col-span-6', placeholder: 'Select state...' },
  { name: 'city', label: 'City', type: 'select', required: true, className: 'md:col-span-6', placeholder: 'Select city...' },
  { name: 'pincode', label: 'Pincode', type: 'text', required: true, className: 'md:col-span-6', placeholder: 'Enter pincode...' },
  { name: 'password', label: 'Password', type: 'password', required: true, className: 'md:col-span-6', placeholder: 'Enter password...' },
  { name: 'agencyLogo', label: 'Agency Logo', type: 'file', required: true, className: 'md:col-span-6', accept: 'image/*' }, 
  { name: 'photo', label: 'Contact Photo', type: 'file', required: true, className: 'md:col-span-6', accept: 'image/*' },
  { name: 'uploadIdProof', label: 'ID Proof (PDF only)', type: 'file', required: true, className: 'md:col-span-6', accept: '.pdf,application/pdf' },
  { name: 'uploadBusinessProof', label: 'Business Proof (PDF only)', type: 'file', required: true, className: 'md:col-span-6', accept: '.pdf,application/pdf' },

];
