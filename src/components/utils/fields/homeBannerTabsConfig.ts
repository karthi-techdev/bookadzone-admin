import type { FieldConfig } from '../../types/common';
export const bannerOneFields: FieldConfig[] = [
  { name: 'bannerOneTitle', label: 'Title', type: 'text', required:true ,className: 'md:col-span-6' },
  { name: 'highlightedText', label: 'Highlighted Text', type: 'text', required:true  ,className: 'md:col-span-6'},
  
  { name: 'subHead1', label: 'Sub Head 1', type: 'text', required:true ,className: 'md:col-span-6' },
  { name: 'subDescription1', label: 'Sub Description 1', type: 'textarea', required:true ,className: 'md:col-span-6' },
  { name: 'image1', label: 'Image 1', type: 'file', required:true , accept: 'image/*',className: 'md:col-span-12' },

  { name: 'subHead2', label: 'Sub Head 2', type: 'text', required:true  ,className: 'md:col-span-6'},
  { name: 'subDescription2', label: 'Sub Description 2', type: 'textarea', required:true ,className: 'md:col-span-6' },
  { name: 'image2', label: 'Image 2', type: 'file', required:true , accept: 'image/*',className: 'md:col-span-12'  },

  { name: 'subHead3', label: 'Sub Head 3', type: 'text', required:true  ,className: 'md:col-span-6'},
  { name: 'subDescription3', label: 'Sub Description 3', type: 'textarea', required:true ,className: 'md:col-span-6' },
  { name: 'image3', label: 'Image 3', type: 'file', required:true , accept: 'image/*', className: 'md:col-span-12' },

];

export const bannerTwoFields: FieldConfig[] = [
  { name: 'bannerTwoTitle', label: 'Title', type: 'text', required:true ,className: 'md:col-span-6' },
  { name: 'description', label: 'Description', type: 'textarea', required:true ,className: 'md:col-span-6' },
  { name: 'buttonName', label: 'Button Name', type: 'text', required:true,className: 'md:col-span-6'  },
  { name: 'buttonUrl', label: 'Button URL', type: 'text', required:true ,className: 'md:col-span-6' },
  { name: 'backgroundImage', label: 'Background Image', type: 'file', required:true , accept: 'image/*', className: 'md:col-span-12' },
];

export const bannerTwoFeaturesFields: FieldConfig[] = [
  { name: 'icon', label: 'Icon', type: 'text' },
  { name: 'title', label: 'Title', type: 'text' },
];

export const homeBannerTabsConfig = [
  {
    id: 1,
    label: 'Banner One',
    fields: bannerOneFields,
    isDynamic: false,
  },
  {
    id: 2,
    label: 'Banner Two',
    fields: bannerTwoFields,
    isDynamic: true,
    dynamicFieldName: 'features',
    dynamicFieldConfig: bannerTwoFeaturesFields,
    dynamicFieldLimit: 10,
  }
];
