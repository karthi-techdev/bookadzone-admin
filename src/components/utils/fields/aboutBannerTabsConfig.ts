export const aboutBannerFourDynamicField = {
  name: 'aboutBannerFourHistory',
  label: 'Brief History',
  type: 'dynamic',
  config: [
    { name: 'year', label: 'Year', type: 'text' },
    { name: 'month', label: 'Month', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
  ],
  limit: 1,
};
export const aboutBannerFourTitleField = {
  name: 'aboutBannerFourTitle',
  label: 'Title',
  type: 'text',
};
export const aboutSubmenu1Fields = [
  { name: 'aboutSubmenu1Title', label: 'Title', type: 'text' },
  { name: 'aboutSubmenu1Description', label: 'Description', type: 'textarea' },
  { name: 'aboutSubmenu1BackgroundImage', label: 'Background Image', type: 'file', required: false, accept: 'image/*' },
];

export const aboutSubmenu2Fields = [
  { name: 'aboutSubmenu2Title', label: 'Title', type: 'text' },
  { name: 'aboutSubmenu2Description', label: 'Description', type: 'textarea' },
  { name: 'aboutSubmenu2BackgroundImage', label: 'Background Image', type: 'file', required: false, accept: 'image/*' },
];

export const aboutSubmenu3Fields = [
  { name: 'aboutSubmenu3Title', label: 'Title', type: 'text' },
  { name: 'aboutSubmenu3Description', label: 'Description', type: 'textarea' },
];

export const aboutSubmenuImagesFields = [
  { name: 'aboutSubmenu1Images', label: 'Images', type: 'file', required: false, accept: 'image/*', multiple: true },
  { name: 'aboutSubmenu2Images', label: 'Images', type: 'file', required: false, accept: 'image/*', multiple: true },
];

export const aboutSmallBoxDynamicField = {
  name: 'aboutSmallBoxes',
  label: 'Small Boxes',
  type: 'dynamic',
  config: [
    { name: 'count', label: 'Count', type: 'text' },
    { name: 'label', label: 'Label', type: 'text' },
  ],
  limit: 4,
};
