import React from 'react';

interface OgPreviewCardProps {
  image?: string;
  title?: string;
  description?: string;
  url: string;
  className?: string;
}

const OgPreviewCard: React.FC<OgPreviewCardProps> = ({
  image,
  title,
  description,
  url,
  className = ''
}) => {
  return (
    <div data-testid="og-preview-card" className={`bg-[var(--dark-color)] rounded-lg overflow-hidden ${className}`}>
      {image && (
        <div className="aspect-[1200/630] bg-[var(--light-dark-color)] relative overflow-hidden">
          <img
            src={image}
            alt={title?.trim() || 'Preview image'}
            className="w-full h-full object-cover rounded-t-lg"
          />
        </div>
      )}
      <div className="p-6 border border-[var(--light-blur-grey-color)] rounded-lg mt-2">
        <h4 className="font-medium text-base text-[var(--white-color)] mb-2">
          {title?.trim() || 'Title not set'}
        </h4>
        <p className="text-sm text-[var(--light-grey-color)] mb-3 line-clamp-2">
          {description?.trim() || 'Description not set'}
        </p>
        <p className="text-xs text-[var(--light-blur-grey-color)] flex items-center">
          <svg 
            data-testid="link-icon"
            className="w-3 h-3 mr-1.5 text-[var(--light-grey-color)]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {url}
        </p>
      </div>
    </div>
  );
};

export default OgPreviewCard;