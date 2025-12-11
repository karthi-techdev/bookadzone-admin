import type { FieldConfig } from '../../types/common';

// Dynamic fields config for specifications
export const specificationsDynamicFields: FieldConfig[] = [
  { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Enter specification title...' },
  { name: 'feature', label: 'Feature', type: 'text', required: true, placeholder: 'Enter specification feature...' },
];

export const propertyFields: FieldConfig[] = [
  { name: 'title', label: 'Title', type: 'text', required: true, className: 'md:col-span-6', placeholder: 'Enter property title...' },
  { name: 'slug', label: 'Slug', type: 'text', required: true, className: 'md:col-span-6', placeholder: 'Auto-generated from title', readOnly: true },
  { name: 'bannerCode', label: 'Banner Code', type: 'text', required: true, className: 'md:col-span-6', placeholder: 'Unique banner code' },

  { name: 'category', label: 'Category', type: 'select', required: true, className: 'md:col-span-6', options: [], placeholder: 'Select category...' },

  { name: 'locationType', label: 'Location Type', type: 'select', required: true, className: 'md:col-span-6', options: [], placeholder: 'Select location type...' },
  { name: 'locationName', label: 'Location Name', type: 'text', required: true, className: 'md:col-span-6', placeholder: 'Enter location name...' },
  { name: 'address', label: 'Address', type: 'text', required: true, className: 'md:col-span-6', placeholder: 'Enter full address...' },
  { name: 'city', label: 'City', type: 'text', required: true, className: 'md:col-span-6', placeholder: 'Enter city name...' },
  { name: 'state', label: 'State', type: 'text', required: true, className: 'md:col-span-6', placeholder: 'Enter state name...' },
  { name: 'pincode', label: 'Pincode', type: 'text', required: true, className: 'md:col-span-6', placeholder: 'Enter pincode...' },
  { name: 'landmark', label: 'Landmark', type: 'text', required: false, className: 'md:col-span-6', placeholder: 'Enter nearby landmark...' },

  { name: 'coordinates.latitude', label: 'Latitude', type: 'number', required: true, className: 'md:col-span-6', valueAsNumber: true, placeholder: 'Enter latitude...' },
  { name: 'coordinates.longitude', label: 'Longitude', type: 'number', required: true, className: 'md:col-span-6', valueAsNumber: true, placeholder: 'Enter longitude...' },

  { name: 'images', label: 'Images', type: 'file', required: false, className: 'md:col-span-12', multiple: true, accept: '.jpg,.png,.jpeg' },
  // { name: 'previewImage', label: 'Preview Image', type: 'file', required: false, className: 'md:col-span-6', multiple: true, accept: '.jpg,.png' },

  { name: 'size.height', label: 'Height (m)', type: 'number', required: true, className: 'md:col-span-6', valueAsNumber: true, placeholder: 'Enter height...' },
  { name: 'size.width', label: 'Width (m)', type: 'number', required: true, className: 'md:col-span-6', valueAsNumber: true, placeholder: 'Enter width...' },
  { name: 'orientation', label: 'Orientation', type: 'select', required: true, className: 'md:col-span-6', options: [], placeholder: 'Select orientation...' },

  { name: 'pricingType', label: 'Pricing Type', type: 'select', required: true, className: 'md:col-span-6', options: [], placeholder: 'Select pricing type...' },
  { name: 'days', label: 'Days', type: 'number', required: true, className: 'md:col-span-6', valueAsNumber: true, placeholder: 'Enter number of days...' },
  { name: 'priceRange.min', label: 'Price Min', type: 'number', required: true, className: 'md:col-span-6', valueAsNumber: true, placeholder: 'Enter minimum price...' },
  { name: 'priceRange.max', label: 'Price Max', type: 'number', required: true, className: 'md:col-span-6', valueAsNumber: true, placeholder: 'Enter maximum price...' },

  { name: 'template', label: 'Template', type: 'text', required: true, className: 'md:col-span-6', placeholder: 'Enter property template...' },



  { name: 'estimatedMonthlyImpressions', label: 'Estimated Monthly Impressions', type: 'text', required: true, className: 'md:col-span-6', placeholder: 'e.g. 1.5M' },
  { name: 'dailyVisibilityDuration', label: 'Daily Visibility', type: 'text', required: true, className: 'md:col-span-6', placeholder: 'e.g. 18 hours' },
  { name: 'vehicleTrafficData', label: 'Vehicle Traffic (ADT)', type: 'number', required: true, className: 'md:col-span-6', valueAsNumber: true, placeholder: 'Enter vehicle traffic data...' },
  { name: 'audienceDwellTime', label: 'Audience Dwell Time', type: 'text', required: true, className: 'md:col-span-6', placeholder: 'e.g. 30 seconds' },

  { name: 'nearbyInstitutions', label: 'Nearby Institutions', type: 'array', required: false, className: 'md:col-span-6', arrayFields: [{ name: 'value', label: 'Institution', type: 'text' }] },
  { name: 'interests', label: 'Interests', type: 'select', required: false, className: 'md:col-span-6', options: [], multiple: false },

  { name: 'zone', label: 'Zone', type: 'select', required: true, className: 'md:col-span-6', options: [], placeholder: 'Select zone...' },

  { name: 'bannerVisibilityRange', label: 'Visibility Range (m)', type: 'number', required: true, className: 'md:col-span-6', valueAsNumber: true, placeholder: 'Enter visibility range...' },

  { name: 'fileTypeAllowed', label: 'Allowed File Types', type: 'select', required: false, className: 'md:col-span-6', options: [], placeholder: 'Select file type...' },

  { name: 'propertyStatus', label: 'Property Status', type: 'select', required: true, className: 'md:col-span-6', options: [], placeholder: 'Select property status...' },

  { name: 'isDeleted', label: 'Deleted', type: 'text', className: 'hidden', defaultValue: false, disabled: true },
];

