import { render, screen } from '@testing-library/react';
import OgPreviewCard from './OgPreviewCard';

describe('OgPreviewCard', () => {
  it('renders OgPreviewCard with minimal required props', () => {
    render(<OgPreviewCard url="http://test.com" />);
    const ogPreview = screen.getByTestId('og-preview-card');
    expect(ogPreview).toBeInTheDocument();
  });

  it('renders OgPreviewCard with all props', () => {
    render(
      <OgPreviewCard
        image="test.jpg"
        title="Test Title"
        description="Test Description"
        url="http://test.com"
        className="custom-class"
      />,
    );
    const ogPreview = screen.getByTestId('og-preview-card');
    const ogImage = screen.getByRole('img');
    const ogTitle = screen.getByText('Test Title');
    const ogDescription = screen.getByText('Test Description');
    
    expect(ogPreview).toBeInTheDocument();
    expect(ogPreview).toHaveClass('custom-class');
    expect(ogImage).toBeInTheDocument();
    expect(ogTitle).toBeInTheDocument();
    expect(ogDescription).toBeInTheDocument();
  });

  it('renders without image', () => {
    render(
      <OgPreviewCard
        title="Test Title"
        description="Test Description"
        url="http://test.com"
      />,
    );
    const ogPreview = screen.getByTestId('og-preview-card');
    const ogTitle = screen.getByText('Test Title');
    const ogDescription = screen.getByText('Test Description');
    
    expect(ogPreview).toBeInTheDocument();
    expect(ogTitle).toBeInTheDocument();
    expect(ogDescription).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('renders without title and description', () => {
    render(<OgPreviewCard url="http://test.com" image="test.jpg" />);
    const ogPreview = screen.getByTestId('og-preview-card');
    const ogImage = screen.getByRole('img');
    
    expect(ogPreview).toBeInTheDocument();
    expect(ogImage).toBeInTheDocument();
    expect(screen.queryByText(/Test Title/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Test Description/)).not.toBeInTheDocument();
  });
});