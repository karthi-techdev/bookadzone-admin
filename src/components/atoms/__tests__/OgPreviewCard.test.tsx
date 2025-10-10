import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import OgPreviewCard from '../OgPreviewCard';

describe('OgPreviewCard', () => {
  const defaultProps = {
    title: 'Test Title',
    description: 'Test Description',
    url: 'https://test.com',
    image: 'https://test.com/image.jpg'
  };

  describe('basic rendering', () => {
    it('renders with all props provided', () => {
      const { container } = render(<OgPreviewCard {...defaultProps} />);
      expect(container).toBeInTheDocument();
      
      expect(screen.getByAltText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('https://test.com')).toBeInTheDocument();
    });

    it('renders without image', () => {
      const { image, ...propsWithoutImage } = defaultProps;
      const { container } = render(<OgPreviewCard {...propsWithoutImage} />);
      
      expect(container.querySelector('img')).not.toBeInTheDocument();
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });
  });

  describe('title fallbacks', () => {
    it('renders with default title when title is undefined', () => {
      const { title, ...propsWithoutTitle } = defaultProps;
      render(<OgPreviewCard {...propsWithoutTitle} />);
      expect(screen.getByText('Title not set')).toBeInTheDocument();
    });

    it('renders with default title when title is empty string', () => {
      render(<OgPreviewCard {...defaultProps} title="" />);
      expect(screen.getByText('Title not set')).toBeInTheDocument();
    });

    it('uses default title in image alt text when title is not provided', () => {
      const { title, ...propsWithoutTitle } = defaultProps;
      render(<OgPreviewCard {...propsWithoutTitle} />);
      expect(screen.getByAltText('Preview image')).toBeInTheDocument();
    });
  });

  describe('description fallbacks', () => {
    it('renders with default description when description is undefined', () => {
      const { description, ...propsWithoutDescription } = defaultProps;
      render(<OgPreviewCard {...propsWithoutDescription} />);
      expect(screen.getByText('Description not set')).toBeInTheDocument();
    });

    it('renders with default description when description is empty string', () => {
      render(<OgPreviewCard {...defaultProps} description="" />);
      expect(screen.getByText('Description not set')).toBeInTheDocument();
    });
  });

  it('applies custom className', () => {
    const { container } = render(<OgPreviewCard {...defaultProps} className="custom-class" />);
    
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('bg-[var(--dark-color)]', 'rounded-lg', 'overflow-hidden', 'custom-class');
  });

  it('renders image with correct attributes and container', () => {
    const { container } = render(<OgPreviewCard {...defaultProps} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveClass('w-full', 'h-full', 'object-cover', 'rounded-t-lg');
    expect(image).toHaveAttribute('src', 'https://test.com/image.jpg');
    
    const imageContainer = container.querySelector('div[data-testid="og-preview-card"] > div:first-child');
    expect(imageContainer).toHaveClass('aspect-[1200/630]', 'bg-[var(--light-dark-color)]', 'relative', 'overflow-hidden');
  });

  it('renders link icon with URL', () => {
    render(<OgPreviewCard {...defaultProps} />);
    
    const linkIcon = screen.getByTestId('link-icon');
    expect(linkIcon).toHaveAttribute('viewBox', '0 0 24 24');
    expect(screen.getByText('https://test.com')).toBeInTheDocument();
  });

  it('renders with proper card structure', () => {
    const { container } = render(<OgPreviewCard {...defaultProps} />);
    
    const mainContainer = container.querySelector('div[data-testid="og-preview-card"]');
    expect(mainContainer).toHaveClass('bg-[var(--dark-color)]', 'rounded-lg', 'overflow-hidden');
    
    const contentContainer = container.querySelector('div[data-testid="og-preview-card"] > div:last-child');
    expect(contentContainer).toHaveClass('p-6', 'border', 'border-[var(--light-blur-grey-color)]', 'rounded-lg');
  });

  it('handles long description with line clamp', () => {
    const longDescription = 'A'.repeat(200);
    render(<OgPreviewCard {...defaultProps} description={longDescription} />);
    
    const description = screen.getByText(longDescription);
    expect(description).toHaveClass('line-clamp-2');
  });

  it('uses fallback alt text when title is not provided', () => {
    const { title, ...propsWithoutTitle } = defaultProps;
    render(<OgPreviewCard {...propsWithoutTitle} />);
    
    expect(screen.getByAltText('Preview image')).toBeInTheDocument();
  });
});