export const debugOgTags = () => {
  const ogTags = {
    title: document.querySelector('meta[property="og:title"]')?.getAttribute('content'),
    description: document.querySelector('meta[property="og:description"]')?.getAttribute('content'),
    image: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
    url: document.querySelector('meta[property="og:url"]')?.getAttribute('content'),
    type: document.querySelector('meta[property="og:type"]')?.getAttribute('content')
  };

  console.log('Open Graph Tags:', ogTags);
  return ogTags;
};